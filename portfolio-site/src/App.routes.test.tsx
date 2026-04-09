import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from './App'

const renderWithRoute = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )

describe('portfolio routing and conversion', () => {
  it('renders homepage with four case-study links and conversion CTA', () => {
    renderWithRoute('/')

    expect(
      screen.getByRole('heading', { name: /Temilade Somade/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /View Case Study:/i })).toHaveLength(
      4,
    )

    const contactLinks = screen.getAllByRole('link', {
      name: /Contact for Opportunities/i,
    })
    expect(contactLinks.length).toBeGreaterThan(0)
    expect(contactLinks[0]).toHaveAttribute('href', expect.stringMatching(/^mailto:/))
    expect(
      screen.getByRole('heading', { name: /Core Skills/i }),
    ).toBeInTheDocument()
  })

  it('navigates to a project case study from homepage', async () => {
    const user = userEvent.setup()
    renderWithRoute('/')

    await user.click(
      screen.getByRole('link', {
        name: /View Case Study: Modern Data Warehouse Architecture/i,
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: /Modern Data Warehouse Architecture for Scalable Business Intelligence/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Business Impact/i }),
    ).toBeInTheDocument()
  })

  it('shows a graceful 404 page for unknown slugs', () => {
    renderWithRoute('/projects/not-a-real-project')

    expect(
      screen.getByRole('heading', { name: /Case Study Not Found/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to Portfolio/i })).toBeInTheDocument()
  })

  it('renders content studio for self-serve profile updates', () => {
    renderWithRoute('/studio')

    expect(screen.getByRole('heading', { name: /Content Studio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Project/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Skill Category/i })).toBeInTheDocument()
  })
})
