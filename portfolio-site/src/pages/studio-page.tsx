import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import { usePortfolioContent } from '../components/portfolio-content-provider'
import { defaultPortfolioContent } from '../data/portfolio-content'
import type { PortfolioContent, Project, ProjectType } from '../types/portfolio'

function createBlankProject(index: number): Project {
  return {
    slug: `new-project-${index}`,
    projectType: 'sql',
    title: 'New Project Title',
    summary: 'Short summary of the project outcome and value.',
    role: 'Data Analyst',
    period: '2026',
    tools: ['SQL'],
    tags: ['Analytics'],
    heroImage: '/projects/sql-modern-warehouse.svg',
    metrics: [{ label: 'Impact', value: 'TBD', delta: 'Define key result', trend: 'up' }],
    links: { github: 'https://github.com/' },
    caseStudy: {
      problem: ['Describe the problem this project solved.'],
      approach: ['Describe the implementation approach.'],
      insights: ['Describe one actionable insight.'],
      impact: ['Describe measurable business impact.'],
    },
  }
}

export function StudioPage() {
  const { content, updateContent, resetContent } = usePortfolioContent()
  const [draft, setDraft] = useState<PortfolioContent>(content)
  const [status, setStatus] = useState<string>('')

  const jsonPreview = useMemo(() => JSON.stringify(draft, null, 2), [draft])

  const setProfileField = (field: keyof PortfolioContent['profile'], value: string) => {
    setDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }))
  }

  const setSkillTitle = (index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, skillIndex) =>
        skillIndex === index ? { ...skill, title: value } : skill,
      ),
    }))
  }

  const setSkillItems = (index: number, value: string) => {
    const parsed = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, skillIndex) =>
        skillIndex === index ? { ...skill, items: parsed } : skill,
      ),
    }))
  }

  const addSkillCategory = () => {
    setDraft((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: `skill-${Date.now()}`, title: 'New Skill Category', items: ['New Skill'] },
      ],
    }))
  }

  const removeSkillCategory = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, skillIndex) => skillIndex !== index),
    }))
  }

  const setProjectField = (index: number, field: keyof Project, value: string) => {
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.map((project, projectIndex) => {
        if (projectIndex !== index) {
          return project
        }

        if (field === 'projectType') {
          return { ...project, projectType: value as ProjectType }
        }

        return {
          ...project,
          [field]: value,
        }
      }),
    }))
  }

  const addProject = () => {
    setDraft((prev) => ({
      ...prev,
      projects: [...prev.projects, createBlankProject(prev.projects.length + 1)],
    }))
  }

  const removeProject = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, projectIndex) => projectIndex !== index),
    }))
  }

  const saveChanges = () => {
    updateContent(draft)
    setStatus('Changes saved locally. The portfolio now uses this updated content.')
  }

  const resetToDefaults = () => {
    resetContent()
    setDraft(defaultPortfolioContent)
    setStatus('Reset to default content.')
  }

  const downloadJson = () => {
    const blob = new Blob([jsonPreview], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'portfolio-content.json'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as PortfolioContent
        if (!parsed.profile || !Array.isArray(parsed.skills) || !Array.isArray(parsed.projects)) {
          throw new Error('Invalid shape')
        }
        setDraft(parsed)
        setStatus('Imported JSON loaded into studio. Click Save Changes to publish it.')
      } catch {
        setStatus('Import failed. Please use a valid portfolio-content JSON file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <section className="mx-auto w-full matext-(--ink)2 md:px-10 md:py-16">
      <h1 className="font-serif text-4xl text-(--ink) md:text-6xl">Content Studio</h1>
      <p className="mt-4 max-w-3xl text-sm text-[#afbdd8]">
        Edit profile details, skills, and project list here. Save changes to apply instantly to the
        portfolio.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="cta cursor-pointer" onClick={saveChanges} type="button">
          Save Changes
        </button>
        <button className="link-chip cursor-pointer" onClick={resetToDefaults} type="button">
          Reset Defaults
        </button>
        <button className="link-chip cursor-pointer" onClick={downloadJson} type="button">
          Export JSON
        </button>
        <label className="link-chip cursor-pointer">
          Import JSON
          <input className="hidden" onChange={importJson} type="file" />
        </label>
      </div>

      {status ? <p className="mt-4 text-sm text-(--accent)">{status}</p> : null}

      <article className="surface-panel mt-8 p-6">
        <h2 className="font-serif text-3xl text-(--ink)">Profile</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="studio-input"
            onChange={(event) => setProfileField('name', event.target.value)}
            placeholder="Name"
            value={draft.profile.name}
          />
          <input
            className="studio-input"
            onChange={(event) => setProfileField('role', event.target.value)}
            placeholder="Role"
            value={draft.profile.role}
          />
          <input
            className="studio-input md:col-span-2"
            onChange={(event) => setProfileField('headline', event.target.value)}
            placeholder="Headline"
            value={draft.profile.headline}
          />
          <textarea
            className="studio-input md:col-span-2"
            onChange={(event) => setProfileField('intro', event.target.value)}
            placeholder="Intro"
            rows={3}
            value={draft.profile.intro}
          />
          <input
            className="studio-input"
            onChange={(event) => setProfileField('contactEmail', event.target.value)}
            placeholder="Email"
            value={draft.profile.contactEmail}
          />
          <input
            className="studio-input"
            onChange={(event) => setProfileField('linkedInUrl', event.target.value)}
            placeholder="LinkedIn URL"
            value={draft.profile.linkedInUrl}
          />
        </div>
      </article>

      <article className="surface-panel mt-8 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-3xl text-(--ink)">Skills</h2>
          <button className="link-chip cursor-pointer" onClick={addSkillCategory} type="button">
            Add Skill Category
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {draft.skills.map((skill, index) => (
            <div className="metric-tile space-y-3 p-4" key={skill.id}>
              <input
                className="studio-input"
                onChange={(event) => setSkillTitle(index, event.target.value)}
                value={skill.title}
              />
              <textarea
                className="studio-input"
                onChange={(event) => setSkillItems(index, event.target.value)}
                rows={2}
                value={skill.items.join(', ')}
              />
              <button
                className="link-chip cursor-pointer"
                onClick={() => removeSkillCategory(index)}
                type="button"
              >
                Remove Category
              </button>
            </div>
          ))}
        </div>
      </article>

      <article className="surface-panel mt-8 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-3xl text-(--ink)">Projects</h2>
          <button className="link-chip cursor-pointer" onClick={addProject} type="button">
            Add Project
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {draft.projects.map((project, index) => (
            <div className="metric-tile grid gap-3 p-4 md:grid-cols-2" key={`${project.slug}-${index}`}>
              <input
                className="studio-input"
                onChange={(event) => setProjectField(index, 'title', event.target.value)}
                value={project.title}
              />
              <input
                className="studio-input"
                onChange={(event) => setProjectField(index, 'slug', event.target.value)}
                value={project.slug}
              />
              <textarea
                className="studio-input md:col-span-2"
                onChange={(event) => setProjectField(index, 'summary', event.target.value)}
                rows={2}
                value={project.summary}
              />
              <select
                className="studio-input"
                onChange={(event) => setProjectField(index, 'projectType', event.target.value)}
                value={project.projectType}
              >
                <option value="sql">SQL</option>
                <option value="tableau">Tableau</option>
              </select>
              <button
                className="link-chip cursor-pointer"
                onClick={() => removeProject(index)}
                type="button"
              >
                Remove Project
              </button>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
