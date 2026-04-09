import { Link, useParams } from 'react-router-dom'

import { usePortfolioContent } from '../components/portfolio-content-provider'

function sectionItems(title: string, items: string[]) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-(--ink) md:text-3xl">{title}</h2>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li className="text-sm leading-relaxed text-(--muted)" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const { content } = usePortfolioContent()
  const { projects, profile } = content
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 py-20 text-center md:px-10">
        <h1 className="font-serif text-4xl text-(--ink)">Case Study Not Found</h1>
        <p className="mt-4 text-sm leading-relaxed text-(--muted)">
          The requested project slug does not exist in this portfolio.
        </p>
        <Link className="cta mt-8 inline-flex" to="/">
          Back to Portfolio
        </Link>
      </section>
    )
  }

  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <Link
        className="link-chip mb-8"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        to="/"
      >
        Back to Portfolio
      </Link>

      <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">{project.role}</p>
      <h1 className="mt-3 max-w-5xl font-serif text-3xl leading-tight text-(--ink) md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#b3c1db]">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tools.map((tool) => (
          <span
            className="border border-(--line) bg-[#101a2d] px-2 py-1 text-xs uppercase tracking-[0.08em] text-(--muted)"
            key={tool}
          >
            {tool}
          </span>
        ))}
      </div>

      {project.heroImage ? (
        <div className="surface-panel mt-8 overflow-hidden">
          <img
            alt={`${project.title} visual evidence`}
            className="h-full w-full object-cover"
            src={project.heroImage}
          />
        </div>
      ) : null}

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {project.metrics.map((metric) => (
          <div className="metric-tile p-4" key={metric.label}>
            <p className="text-xs uppercase tracking-[0.16em] text-(--muted)">{metric.label}</p>
            <p className="mt-3 font-serif text-3xl text-(--ink)">{metric.value}</p>
            <p className="mt-2 text-sm text-[#b2c0dc]">{metric.delta}</p>
          </div>
        ))}
      </section>

      <div className="mt-12 grid gap-9 md:grid-cols-2">
        {sectionItems('Project Problem', project.caseStudy.problem)}
        {sectionItems('Approach', project.caseStudy.approach)}
        {sectionItems('Key Insights', project.caseStudy.insights)}
        {sectionItems('Business Impact', project.caseStudy.impact)}
      </div>

      <section className="mt-12 border-t border-(--line) pt-8">
        <h2 className="font-serif text-2xl text-(--ink) md:text-3xl">Project Links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {project.links.github ? (
            <a className="link-chip" href={project.links.github} rel="noreferrer" target="_blank">
              View GitHub Repository
            </a>
          ) : null}
          {project.links.tableau ? (
            <a className="link-chip" href={project.links.tableau} rel="noreferrer" target="_blank">
              View Live Dashboard
            </a>
          ) : null}
          <a className="link-chip" href={profile.linkedInUrl} rel="noreferrer" target="_blank">
            Connect on LinkedIn
          </a>
          <a className="cta" href={`mailto:${profile.contactEmail}`}>
            Contact for Opportunities
          </a>
        </div>
      </section>
    </article>
  )
}

