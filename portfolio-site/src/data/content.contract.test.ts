import { describe, expect, it } from 'vitest'

import { defaultPortfolioContent } from './portfolio-content'

describe('portfolio content contract', () => {
  it('includes editable profile information', () => {
    expect(defaultPortfolioContent.profile.name).toBeTruthy()
    expect(defaultPortfolioContent.profile.role).toBeTruthy()
    expect(defaultPortfolioContent.profile.headline).toBeTruthy()
  })

  it('includes at least three skill categories with items', () => {
    expect(defaultPortfolioContent.skills.length).toBeGreaterThanOrEqual(3)
    for (const category of defaultPortfolioContent.skills) {
      expect(category.title).toBeTruthy()
      expect(category.items.length).toBeGreaterThan(0)
    }
  })
})

