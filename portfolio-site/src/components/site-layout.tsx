import { Link } from 'react-router-dom'

import type { ReactNode } from 'react'
import { usePortfolioContent } from './portfolio-content-provider'

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const { content } = usePortfolioContent()

  return (
    <div className="ambient-grid min-h-screen bg-(--canvas) text-(--ink)">
      <header className="sticky top-0 z-50 border-b border-(--line) bg-[#080d17]/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link className="group text-sm uppercase tracking-[0.24em] text-(--muted)" to="/">
            <span className="text-(--ink) transition-colors group-hover:text-(--accent)">
              Temilade
            </span>{' '}
            Portfolio
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <a
              className="link-chip"
              href={content.profile.linkedInUrl}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className="cta" href={`mailto:${content.profile.contactEmail}`}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-(--line) bg-[#070d18]/95">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-sm text-(--muted)">
            Data Analyst & BI Specialist portfolio.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className="link-chip"
              href={content.profile.linkedInUrl}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className="cta" href={`mailto:${content.profile.contactEmail}`}>
              Contact for Opportunities
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
