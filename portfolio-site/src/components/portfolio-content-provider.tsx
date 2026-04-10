/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { defaultPortfolioContent } from '../data/portfolio-content'
import type { PortfolioContent } from '../types/portfolio'

const CONTENT_ENDPOINT = '/api/portfolio-content'

interface PortfolioContentContextValue {
  content: PortfolioContent
  updateContent: (next: PortfolioContent) => Promise<void>
  resetContent: () => Promise<void>
}

const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null)

interface PortfolioContentProviderProps {
  children: ReactNode
}

function isPortfolioContent(input: unknown): input is PortfolioContent {
  if (!input || typeof input !== 'object') {
    return false
  }

  const value = input as Partial<PortfolioContent>
  return Boolean(
    value.profile && Array.isArray(value.projects) && Array.isArray(value.skills),
  )
}

function parseContentPayload(input: unknown): PortfolioContent | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const payload = input as { content?: unknown }
  if (!isPortfolioContent(payload.content)) {
    return null
  }

  return payload.content
}

async function fetchSharedContent(): Promise<PortfolioContent | null> {
  const response = await fetch(CONTENT_ENDPOINT, { cache: 'no-store' })
  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as unknown
  return parseContentPayload(payload)
}

async function saveSharedContent(next: PortfolioContent): Promise<PortfolioContent | null> {
  const response = await fetch(CONTENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(next),
  })

  if (!response.ok) {
    throw new Error(`Failed to save content (${response.status})`)
  }

  const payload = (await response.json()) as unknown
  return parseContentPayload(payload)
}

export function PortfolioContentProvider({ children }: PortfolioContentProviderProps) {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const remoteContent = await fetchSharedContent()
        if (isMounted && remoteContent) {
          setContent(remoteContent)
        }
      } catch {
        // Default content remains in place if shared content is unavailable.
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  const updateContent = useCallback(async (next: PortfolioContent) => {
    setContent(next)

    const persisted = await saveSharedContent(next)
    if (persisted) {
      setContent(persisted)
    }
  }, [])

  const resetContent = useCallback(async () => {
    await updateContent(defaultPortfolioContent)
  }, [updateContent])

  const value = useMemo(
    () => ({
      content,
      updateContent,
      resetContent,
    }),
    [content, resetContent, updateContent],
  )

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  )
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContentContext)

  if (!context) {
    throw new Error('usePortfolioContent must be used within PortfolioContentProvider')
  }

  return context
}

