import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PortfolioContent } from '../types/portfolio'
import { PortfolioContentProvider, usePortfolioContent } from './portfolio-content-provider'

function TestConsumer() {
  const { content } = usePortfolioContent()
  return <p>{content.profile.name}</p>
}

describe('PortfolioContentProvider', () => {
  it('loads portfolio content from shared API for all users', async () => {
    const remoteContent: PortfolioContent = {
      profile: {
        name: 'Shared Profile',
        role: 'Analyst',
        headline: 'Shared headline',
        intro: 'Shared intro',
        contactEmail: 'shared@example.com',
        linkedInUrl: 'https://linkedin.com/in/shared',
        tableauProfileUrl: 'https://public.tableau.com/app/profile/shared',
      },
      skills: [{ id: 'shared-skill', title: 'Shared', items: ['One'] }],
      projects: [],
    }

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: remoteContent }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    render(
      <PortfolioContentProvider>
        <TestConsumer />
      </PortfolioContentProvider>,
    )

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/portfolio-content',
        expect.objectContaining({ cache: 'no-store' }),
      ),
    )

    expect(await screen.findByText('Shared Profile')).toBeInTheDocument()

    fetchSpy.mockRestore()
  })
})

