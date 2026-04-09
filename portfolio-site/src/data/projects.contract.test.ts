import { describe, expect, it } from 'vitest'

import { projects } from './projects'

describe('projects content contract', () => {
  it('contains exactly four portfolio projects for v1 launch', () => {
    expect(projects).toHaveLength(4)
  })

  it('uses unique slugs', () => {
    const slugs = projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('includes required fields and non-empty KPI collections', () => {
    for (const project of projects) {
      expect(project.slug).toBeTruthy()
      expect(project.title).toBeTruthy()
      expect(project.summary).toBeTruthy()
      expect(project.tools.length).toBeGreaterThan(0)
      expect(project.metrics.length).toBeGreaterThan(0)
      expect(project.caseStudy.problem.length).toBeGreaterThan(0)
      expect(project.caseStudy.approach.length).toBeGreaterThan(0)
      expect(project.caseStudy.insights.length).toBeGreaterThan(0)
      expect(project.caseStudy.impact.length).toBeGreaterThan(0)
    }
  })

  it('binds outbound links to each project type', () => {
    for (const project of projects) {
      if (project.projectType === 'sql') {
        expect(project.links.github).toMatch(/^https:\/\/github\.com\//)
      }

      if (project.projectType === 'tableau') {
        expect(project.links.tableau).toMatch(/^https:\/\/public\.tableau\.com\//)
      }
    }
  })
})
