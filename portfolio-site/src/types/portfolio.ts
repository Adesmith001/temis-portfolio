export type ProjectType = 'sql' | 'tableau'

export type MetricTrend = 'up' | 'down' | 'flat'

export interface KpiMetric {
  label: string
  value: string
  delta: string
  trend: MetricTrend
  context?: string
}

export interface CaseStudySection {
  problem: string[]
  approach: string[]
  insights: string[]
  impact: string[]
}

export interface ProjectLinks {
  github?: string
  tableau?: string
}

export interface Project {
  slug: string
  projectType: ProjectType
  title: string
  summary: string
  role: string
  period: string
  tools: string[]
  tags: string[]
  heroImage?: string
  metrics: KpiMetric[]
  links: ProjectLinks
  caseStudy: CaseStudySection
}

export interface ProfileContent {
  name: string
  role: string
  headline: string
  intro: string
  contactEmail: string
  linkedInUrl: string
  tableauProfileUrl: string
}

export interface SkillCategory {
  id: string
  title: string
  items: string[]
}

export interface PortfolioContent {
  profile: ProfileContent
  skills: SkillCategory[]
  projects: Project[]
}
