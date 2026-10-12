// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { decksFixture } from '../lib/__fixtures__/decks'
import { CategoryFilter } from './CategoryFilter'

const renderWith = (poolSize: number) =>
  render(
    <CategoryFilter categories={decksFixture.categories} selected={[]} poolSize={poolSize} onToggle={() => {}} onSelectAll={() => {}} />,
  )

describe('CategoryFilter', () => {
  it('conta temas, não perguntas', () => {
    renderWith(140)
    expect(screen.getByText('140 temas')).toBeTruthy()
    expect(screen.queryByText(/pergunta/i)).toBeNull()
  })

  it('usa o singular para 1 tema', () => {
    renderWith(1)
    expect(screen.getByText('1 tema')).toBeTruthy()
  })
})
