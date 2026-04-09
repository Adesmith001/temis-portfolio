import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { ProjectCard } from '../components/project-card'
import { usePortfolioContent } from '../components/portfolio-content-provider'

export function HomePage() {
  const { content } = usePortfolioContent()
  const { profile, skills, projects } = content
  const reduceMotion = useReducedMotion()
  const previewRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.03])
  const y = useTransform(scrollYProgress, [0, 1], [0, -16])

  return (
    <>
      <section className="hero-frame">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_1.08fr] md:items-end md:px-10 md:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#c0cff0]">
              {profile.role}
            </p>
            <h1 className="font-serif text-4xl leading-[0.96] text-(--ink) md:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#b4c4e0]">
              {profile.headline}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-(--muted)">
              {profile.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="cta" href={`mailto:${profile.contactEmail}`}>
                Contact
              </a>
              <a
                className="link-chip"
                href={profile.tableauProfileUrl}
                rel="noreferrer"
                target="_blank"
              >
                Tableau Profile
              </a>
            </div>
          </motion.div>

          <motion.div
            className="surface-panel overflow-hidden"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.74, ease: 'easeOut', delay: 0.09 }}
            style={reduceMotion ? undefined : { y }}
          >
            <img
              alt="Sales dashboard preview from Tableau portfolio"
              className="h-full w-full object-cover"
              src="/projects/sales-customer-1.png"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">Skill Stack</p>
            <h2 className="mt-2 font-serif text-3xl text-(--ink) md:text-5xl">Core Skills</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#afbdd8]">
            Technical depth and business storytelling aligned for real-world analytics impact.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {skills.map((category) => (
            <article className="surface-panel p-5" key={category.id}>
              <h3 className="font-serif text-2xl text-(--ink)">{category.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.items.map((skillItem) => (
                  <li
                    className="border border-(--line) bg-[#101a2d] px-3 py-1 text-xs uppercase tracking-[0.08em] text-(--muted)"
                    key={`${category.id}-${skillItem}`}
                  >
                    {skillItem}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">Selected Work</p>
            <h2 className="mt-2 font-serif text-3xl text-(--ink) md:text-5xl">
              High-Impact Case Studies
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#afbdd8]">
            Warehouse engineering, advanced SQL analytics, and executive-grade dashboards designed
            to drive decisions.
          </p>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-2"
          ref={previewRef}
          style={reduceMotion ? undefined : { scale }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </motion.div>
      </section>
    </>
  )
}
