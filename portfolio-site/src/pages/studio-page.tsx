import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'

import { usePortfolioContent } from '../components/portfolio-content-provider'
import { defaultPortfolioContent } from '../data/portfolio-content'
import type { PortfolioContent, Project, ProjectType } from '../types/portfolio'

const projectTypeOptions: Array<{ value: ProjectType; label: string }> = [
  { value: 'sql', label: 'SQL' },
  { value: 'tableau', label: 'Tableau' },
  { value: 'powerbi', label: 'Power BI' },
  { value: 'python', label: 'Python' },
  { value: 'excel', label: 'Excel' },
  { value: 'other', label: 'Other' },
]

function parseCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createBlankProject(index: number, projectType: ProjectType = 'sql'): Project {
  return {
    slug: `new-project-${index}`,
    projectType,
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

interface StudioModalProps {
  children: ReactNode
  onClose: () => void
  title: string
}

function StudioModal({ children, onClose, title }: StudioModalProps) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-80 flex items-center justify-center bg-[#050913]/84 p-5 backdrop-blur-sm"
      role="dialog"
    >
      <div className="surface-panel w-full max-w-2xl p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl text-(--ink)">{title}</h2>
          <button className="link-chip cursor-pointer" onClick={onClose} type="button">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function StudioPage() {
  const { content, updateContent, resetContent } = usePortfolioContent()
  const [draft, setDraft] = useState<PortfolioContent>(content)
  const [status, setStatus] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [newSkillTitle, setNewSkillTitle] = useState('')
  const [newSkillItems, setNewSkillItems] = useState('')

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectSlug, setNewProjectSlug] = useState('')
  const [newProjectSummary, setNewProjectSummary] = useState('')
  const [newProjectType, setNewProjectType] = useState<ProjectType>('sql')
  const [newProjectTools, setNewProjectTools] = useState('')
  const [newProjectTags, setNewProjectTags] = useState('')

  useEffect(() => {
    setDraft(content)
  }, [content])

  const jsonPreview = useMemo(() => JSON.stringify(draft, null, 2), [draft])

  const publishContent = async (next: PortfolioContent, successMessage: string) => {
    setDraft(next)
    setIsSaving(true)
    try {
      await updateContent(next)
      setStatus(successMessage)
    } catch {
      setStatus(
        'Could not publish to shared storage right now. Keep your edits, then try Save Changes again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

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
    const parsed = parseCommaSeparated(value)

    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, skillIndex) =>
        skillIndex === index ? { ...skill, items: parsed } : skill,
      ),
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

  const removeProject = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, projectIndex) => projectIndex !== index),
    }))
  }

  const saveChanges = async () => {
    await publishContent(
      draft,
      'Changes saved and published. All users now receive the latest portfolio content.',
    )
  }

  const resetToDefaults = async () => {
    setIsSaving(true)
    setDraft(defaultPortfolioContent)
    try {
      await resetContent()
      setStatus('Reset to default content and published to all users.')
    } catch {
      setStatus('Reset locally, but publishing failed. Click Save Changes to retry.')
    } finally {
      setIsSaving(false)
    }
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

  const openSkillModal = () => {
    setNewSkillTitle('')
    setNewSkillItems('')
    setIsSkillModalOpen(true)
  }

  const saveSkillCategory = async () => {
    const title = newSkillTitle.trim()
    if (!title) {
      setStatus('Please enter a category title before saving.')
      return
    }

    const items = parseCommaSeparated(newSkillItems)
    const next: PortfolioContent = {
      ...draft,
      skills: [
        ...draft.skills,
        {
          id: `skill-${Date.now()}`,
          title,
          items: items.length > 0 ? items : ['New Skill'],
        },
      ],
    }

    setIsSkillModalOpen(false)
    await publishContent(next, `Added "${title}" and published it for all users.`)
  }

  const openProjectModal = () => {
    setNewProjectTitle('')
    setNewProjectSlug('')
    setNewProjectSummary('')
    setNewProjectType('sql')
    setNewProjectTools('')
    setNewProjectTags('')
    setIsProjectModalOpen(true)
  }

  const saveProject = async () => {
    const title = newProjectTitle.trim()
    if (!title) {
      setStatus('Please enter a project title before saving.')
      return
    }

    const base = createBlankProject(draft.projects.length + 1, newProjectType)
    const slug = newProjectSlug.trim() || slugify(title) || base.slug
    const tools = parseCommaSeparated(newProjectTools)
    const tags = parseCommaSeparated(newProjectTags)
    const summary = newProjectSummary.trim()

    const nextProject: Project = {
      ...base,
      title,
      slug,
      projectType: newProjectType,
      summary: summary || base.summary,
      tools: tools.length > 0 ? tools : base.tools,
      tags: tags.length > 0 ? tags : base.tags,
    }

    const next: PortfolioContent = {
      ...draft,
      projects: [...draft.projects, nextProject],
    }

    setIsProjectModalOpen(false)
    await publishContent(next, `Added "${title}" and published it for all users.`)
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 text-(--ink) md:px-10 md:py-16">
      <h1 className="font-serif text-4xl text-(--ink) md:text-6xl">Content Studio</h1>
      <p className="mt-4 max-w-3xl text-sm text-[#afbdd8]">
        Edit profile details, skills, and project list here. Save changes to apply instantly to the
        portfolio.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="cta cursor-pointer disabled:opacity-60" disabled={isSaving} onClick={saveChanges} type="button">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        <button className="link-chip cursor-pointer disabled:opacity-60" disabled={isSaving} onClick={resetToDefaults} type="button">
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
          <button className="link-chip cursor-pointer" onClick={openSkillModal} type="button">
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
          <button className="link-chip cursor-pointer" onClick={openProjectModal} type="button">
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
                {projectTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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

      {isSkillModalOpen ? (
        <StudioModal onClose={() => setIsSkillModalOpen(false)} title="Add Skill Category">
          <div className="grid gap-4">
            <label className="text-sm text-(--muted)" htmlFor="new-skill-title">
              Category Title
            </label>
            <input
              className="studio-input"
              id="new-skill-title"
              onChange={(event) => setNewSkillTitle(event.target.value)}
              placeholder="e.g. Cloud Analytics"
              value={newSkillTitle}
            />

            <label className="text-sm text-(--muted)" htmlFor="new-skill-items">
              Skills (comma separated)
            </label>
            <textarea
              className="studio-input"
              id="new-skill-items"
              onChange={(event) => setNewSkillItems(event.target.value)}
              placeholder="e.g. BigQuery, dbt, Airflow"
              rows={3}
              value={newSkillItems}
            />

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="cta cursor-pointer" onClick={saveSkillCategory} type="button">
                Save Skill Category
              </button>
              <button
                className="link-chip cursor-pointer"
                onClick={() => setIsSkillModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </StudioModal>
      ) : null}

      {isProjectModalOpen ? (
        <StudioModal onClose={() => setIsProjectModalOpen(false)} title="Add Project">
          <div className="grid gap-4">
            <label className="text-sm text-(--muted)" htmlFor="new-project-title">
              Project Title
            </label>
            <input
              className="studio-input"
              id="new-project-title"
              onChange={(event) => {
                const nextTitle = event.target.value
                setNewProjectTitle(nextTitle)
                if (!newProjectSlug) {
                  setNewProjectSlug(slugify(nextTitle))
                }
              }}
              placeholder="Project title"
              value={newProjectTitle}
            />

            <label className="text-sm text-(--muted)" htmlFor="new-project-slug">
              Slug
            </label>
            <input
              className="studio-input"
              id="new-project-slug"
              onChange={(event) => setNewProjectSlug(event.target.value)}
              placeholder="project-slug"
              value={newProjectSlug}
            />

            <label className="text-sm text-(--muted)" htmlFor="new-project-summary">
              Summary
            </label>
            <textarea
              className="studio-input"
              id="new-project-summary"
              onChange={(event) => setNewProjectSummary(event.target.value)}
              placeholder="One short summary line"
              rows={3}
              value={newProjectSummary}
            />

            <label className="text-sm text-(--muted)" htmlFor="new-project-type">
              Project Type
            </label>
            <select
              className="studio-input"
              id="new-project-type"
              onChange={(event) => setNewProjectType(event.target.value as ProjectType)}
              value={newProjectType}
            >
              {projectTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label className="text-sm text-(--muted)" htmlFor="new-project-tools">
              Tools (comma separated)
            </label>
            <input
              className="studio-input"
              id="new-project-tools"
              onChange={(event) => setNewProjectTools(event.target.value)}
              placeholder="e.g. SQL, Python, Power BI"
              value={newProjectTools}
            />

            <label className="text-sm text-(--muted)" htmlFor="new-project-tags">
              Tags (comma separated)
            </label>
            <input
              className="studio-input"
              id="new-project-tags"
              onChange={(event) => setNewProjectTags(event.target.value)}
              placeholder="e.g. Forecasting, KPI, Automation"
              value={newProjectTags}
            />

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="cta cursor-pointer" onClick={saveProject} type="button">
                Save Project
              </button>
              <button
                className="link-chip cursor-pointer"
                onClick={() => setIsProjectModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </StudioModal>
      ) : null}
    </section>
  )
}

