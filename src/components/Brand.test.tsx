// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Brand } from './Brand'

describe('Brand', () => {
  it('mostra só "Sorteador de temas" como subtítulo', () => {
    const { container } = render(<Brand />)
    const subtitle = container.querySelector('.brand__subtitle')
    expect(subtitle?.textContent).toBe('Sorteador de temas')
    expect(screen.queryByText(/1 — 100/)).toBeNull()
  })
})
