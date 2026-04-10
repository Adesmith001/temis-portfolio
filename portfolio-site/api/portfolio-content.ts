import { list, put } from '@vercel/blob'

import { defaultPortfolioContent } from '../src/data/portfolio-content'
import type { PortfolioContent } from '../src/types/portfolio'

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

function withNoStoreHeaders(res: {
  setHeader: (name: string, value: string) => void
}) {
  res.setHeader('Cache-Control', 'no-store')
}

async function readSharedContent(): Promise<PortfolioContent | null> {
  const { blobs } = await list({ prefix: CONTENT_BLOB_PATH, limit: 1 })
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

async function writeSharedContent(content: PortfolioContent) {
  await put(CONTENT_BLOB_PATH, JSON.stringify(content), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
  })
}

export default async function handler(
  req: { body?: unknown; method?: string },
  res: {
    status: (statusCode: number) => { json: (body: unknown) => void }
    setHeader: (name: string, value: string) => void
  },
) {
  withNoStoreHeaders(res)

  if (req.method === 'GET') {
    try {
      const sharedContent = await readSharedContent()
      return res
        .status(200)
        .json({ content: sharedContent ?? defaultPortfolioContent })
    } catch {
      return res.status(200).json({ content: defaultPortfolioContent })
    }
  }

  if (req.method === 'POST') {
    let payload: unknown
    try {
      payload =
        typeof req.body === 'string'
          ? (JSON.parse(req.body) as unknown)
          : req.body
    } catch {
      return res.status(400).json({ error: 'Request body must be valid JSON.' })
    }

    if (!isPortfolioContent(payload)) {
      return res.status(400).json({ error: 'Invalid portfolio content payload.' })
    }

    try {
      await writeSharedContent(payload)
      return res.status(200).json({ content: payload })
    } catch {
      return res.status(500).json({
        error:
          'Unable to persist shared content. Configure Vercel Blob for this project.',
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
