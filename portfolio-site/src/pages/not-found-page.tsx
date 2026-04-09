import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 text-center md:px-10">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">404</p>
      <h1 className="mt-3 font-serif text-4xl text-[var(--ink)]">Page Not Found</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        This route does not exist. Return to the portfolio home page.
      </p>
      <Link className="cta mt-8 inline-flex" to="/">
        Back to Portfolio
      </Link>
    </section>
  )
}

