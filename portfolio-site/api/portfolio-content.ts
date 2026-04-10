import { list, put } from '@vercel/blob'

import { defaultPortfolioContent } from '../src/data/portfolio-content'
import type { PortfolioContent } from '../src/types/portfolio'

export const runtime = 'nodejs'

const CONTENT_BLOB_PATH = 'portfolio-content/latest.json'

function isPortfolioContent(input: unknown): input is PortfolioContent {
  if (!input || typeof input !== 'object') {
    return false
  }

  const value = input as Partial<PortfolioContent>
  return Boolean(
    value.profile && Array.isArray(value.projects) && Array.isArray(value.skills),
  )
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim()
}

async function readSharedContent(token: string): Promise<PortfolioContent | null> {
  const { blobs } = await list({
    token,
    prefix: CONTENT_BLOB_PATH,
    limit: 1,
  })

  const targetBlob = blobs.find((blob) => blob.pathname === CONTENT_BLOB_PATH)
  if (!targetBlob) {
    return null
  }

  const blobResponse = await fetch(targetBlob.url, { cache: 'no-store' })
  if (!blobResponse.ok) {
    return null
  }

  const payload = (await blobResponse.json()) as unknown
  if (!isPortfolioContent(payload)) {
    return null
  }

  return payload
}

async function writeSharedContent(content: PortfolioContent, token: string) {
  await put(CONTENT_BLOB_PATH, JSON.stringify(content), {
    token,
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
  })
}

export async function GET() {
  const token = getBlobToken()

  if (!token) {
    return json({
      content: defaultPortfolioContent,
      storage: 'default',
      warning: 'BLOB_READ_WRITE_TOKEN is missing. Shared persistence is disabled.',
    })
  }

  try {
    const sharedContent = await readSharedContent(token)
    return json({
      content: sharedContent ?? defaultPortfolioContent,
      storage: sharedContent ? 'blob' : 'default',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return json({
      content: defaultPortfolioContent,
      storage: 'default',
      warning: `Blob read failed: ${message}`,
    })
  }
}

export async function POST(request: Request) {
  const token = getBlobToken()

  if (!token) {
    return json(
      {
        error:
          'Shared storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel project environment variables.',
      },
      503,
    )
  }

  let payload: unknown
  try {
    payload = (await request.json()) as unknown
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400)
  }

  if (!isPortfolioContent(payload)) {
    return json({ error: 'Invalid portfolio content payload.' }, 400)
  }

  try {
    await writeSharedContent(payload, token)
    return json({ content: payload, storage: 'blob' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return json(
      {
        error: `Unable to persist shared content: ${message}`,
      },
      500,
    )
  }
}

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return GET()
  }

  if (request.method === 'POST') {
    return POST(request)
  }

  return json({ error: 'Method not allowed.' }, 405)
}

