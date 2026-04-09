import { Link } from 'react-router-dom'

import type { ReactNode } from 'react'

interface SiteLayoutProps {
  children: ReactNode
}

const contactEmail = 'temilade.somade@example.com'
const linkedInUrl = 'https://www.linkedin.com/in/temilade-somade/'

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="ambient-grid min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#080d17]/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link className="group text-sm uppercase tracking-[0.24em] text-[var(--muted)]" to="/">
            <span className="text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
              Temilade
            </span>{' '}
            Portfolio
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <a className="link-chip" href={linkedInUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="cta" href={`mailto:${contactEmail}`}>
              Contact for Opportunities
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[var(--line)] bg-[#070d18]/95">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-sm text-[var(--muted)]">
            Data Analyst & BI Specialist portfolio. Built for recruiters and client
            opportunities.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="link-chip" href={linkedInUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="cta" href={`mailto:${contactEmail}`}>
              Contact for Opportunities
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
