import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

import { ProjectCard } from '../components/project-card'
import type { Project } from '../types/portfolio'
import { useRef } from 'react'

interface HomePageProps {
  projects: Project[]
}

export function HomePage({ projects }: HomePageProps) {
  const reduceMotion = useReducedMotion()
  const previewRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.03])
  const y = useTransform(scrollYProgress, [0, 1], [0, -14])

  return (
    <>
      <section className="hero-frame">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_1.1fr] md:items-end md:px-10 md:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#b6c6e6]">
              Data Analyst + BI Specialist
            </p>
            <h1 className="font-serif text-4xl leading-tight text-(--ink) md:text-7xl">
              Temilade Somade
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#b3c0da]">
              I build analytics products that convert raw business data into clear,
              decision-ready strategy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="cta" href="mailto:temilade.somade@example.com">
                Contact for Opportunities
              </a>
              <a
                className="link-chip"
                href="https://public.tableau.com/app/profile/temilade.somade/vizzes"
                rel="noreferrer"
                target="_blank"
              >
                Tableau Profile
              </a>
            </div>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <div className="metric-tile p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-(--muted)">Projects</p>
                <p className="mt-2 font-serif text-2xl text-(--ink)">04</p>
              </div>
              <div className="metric-tile p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-(--muted)">Dashboards</p>
                <p className="mt-2 font-serif text-2xl text-(--ink)">02</p>
              </div>
              <div className="metric-tile p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-(--muted)">Core Stack</p>
                <p className="mt-2 font-serif text-2xl text-(--ink)">SQL + Tableau</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="surface-panel overflow-hidden"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
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
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
              Selected Projects
            </p>
            <h2 className="mt-2 font-serif text-3xl text-(--ink) md:text-5xl">
              Four End-to-End Case Studies
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#afbdd8]">
            Warehouse engineering, advanced SQL analytics, and Tableau dashboard
            systems designed for real business outcomes.
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
