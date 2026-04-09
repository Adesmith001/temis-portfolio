/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { defaultPortfolioContent } from '../data/portfolio-content'
import type { PortfolioContent } from '../types/portfolio'

const STORAGE_KEY = 'temilade-portfolio-content-v1'

interface PortfolioContentContextValue {
  content: PortfolioContent
  updateContent: (next: PortfolioContent) => void
  resetContent: () => void
}

const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null)

interface PortfolioContentProviderProps {
  children: ReactNode
}

function loadContent(): PortfolioContent {
  if (typeof window === 'undefined') {
    return defaultPortfolioContent
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return defaultPortfolioContent
  }

  try {
    const parsed = JSON.parse(raw) as PortfolioContent
    if (!parsed.profile || !Array.isArray(parsed.projects) || !Array.isArray(parsed.skills)) {
      return defaultPortfolioContent
    }
    return parsed
  } catch {
    return defaultPortfolioContent
  }
}

export function PortfolioContentProvider({ children }: PortfolioContentProviderProps) {
  const [content, setContent] = useState<PortfolioContent>(() => loadContent())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  }, [content])

  const value = useMemo(
    () => ({
      content,
      updateContent: (next: PortfolioContent) => setContent(next),
      resetContent: () => setContent(defaultPortfolioContent),
    }),
    [content],
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
