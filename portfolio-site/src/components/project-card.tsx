import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

import type { Project } from '../types/portfolio'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const reduceMotion = useReducedMotion()
  const caseStudyLabel = `View Case Study: ${project.title}`

  return (
    <Link
      aria-label={caseStudyLabel}
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      to={`/projects/${project.slug}`}
    >
      <motion.article
        className="surface-panel group overflow-hidden"
        whileHover={reduceMotion ? undefined : { y: -10, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        {project.heroImage ? (
          <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--line)] bg-[#070b12]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05070d] via-transparent to-transparent opacity-60" />
            <img
              alt={`${project.title} preview`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              src={project.heroImage}
            />
          </div>
        ) : null}

        <div className="space-y-4 p-5 md:p-6">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
            <span className="neon-dot" />
            {project.projectType === 'sql' ? 'SQL Analytics Project' : 'Tableau Dashboard'}
          </p>
          <h3 className="font-serif text-xl leading-tight text-[var(--ink)]">{project.title}</h3>
          <p className="text-sm leading-relaxed text-[#b5c3de]">{project.summary}</p>

          <ul className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <li
                className="border border-[var(--line)] bg-[#101a2d] px-2 py-1 text-xs uppercase tracking-[0.08em] text-[var(--muted)]"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>

          <p className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
            {caseStudyLabel}
          </p>
        </div>
      </motion.article>
    </Link>
  )
}
