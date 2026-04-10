import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import App from '../App'

function renderStudio() {
  return render(
    <MemoryRouter initialEntries={['/slimtemi']}>
      <App />
    </MemoryRouter>,
  )
}

describe('StudioPage', () => {
  it('opens add skill modal and saves a new category', async () => {
    const user = userEvent.setup()
    renderStudio()

    await user.click(screen.getByRole('button', { name: /Add Skill Category/i }))

    expect(
      screen.getByRole('heading', { name: /Add Skill Category/i }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Category Title/i), 'New Skill Category testing')
    await user.type(screen.getByLabelText(/Skills \(comma separated\)/i), 'New Skill')
    await user.click(screen.getByRole('button', { name: /Save Skill Category/i }))

    expect(screen.getByDisplayValue('New Skill Category testing')).toBeInTheDocument()
    expect(screen.getByDisplayValue('New Skill')).toBeInTheDocument()
  })

  it('offers project types beyond SQL and Tableau', async () => {
    const user = userEvent.setup()
    renderStudio()

    await user.click(screen.getByRole('button', { name: /Add Project/i }))
    const projectTypeSelect = screen.getByLabelText(/Project Type/i)
    await user.click(projectTypeSelect)

    expect(within(projectTypeSelect).getByRole('option', { name: /Power BI/i })).toBeInTheDocument()
    expect(within(projectTypeSelect).getByRole('option', { name: /Python/i })).toBeInTheDocument()
    expect(within(projectTypeSelect).getByRole('option', { name: /Excel/i })).toBeInTheDocument()
  })
})
