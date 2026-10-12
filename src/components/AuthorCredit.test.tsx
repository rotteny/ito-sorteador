// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthorCredit } from './AuthorCredit'

describe('AuthorCredit', () => {
  it('linka o perfil do GitHub em nova aba, com rel noopener', () => {
    render(<AuthorCredit />)
    const link = screen.getByRole('link', { name: /feito por @rotteny/ })
    expect(link.getAttribute('href')).toBe('https://github.com/rotteny')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener')
  })
})
