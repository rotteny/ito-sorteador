import { describe, expect, it } from 'vitest'
import { titleSize } from './titleSize'

describe('titleSize', () => {
  it('usa 34px para títulos curtos', () => {
    expect(titleSize('Vilões de filme')).toBe(34)
  })

  it('usa 24px para títulos muito longos', () => {
    expect(
      titleSize('Pense como um pirata: qual seria o tesouro escondido que você mais gostaria de encontrar?'),
    ).toBe(24)
  })

  it('nunca aumenta quando o texto cresce', () => {
    let prev = 34
    for (let n = 1; n <= 140; n++) {
      const size = titleSize('a'.repeat(n))
      expect(size).toBeLessThanOrEqual(prev)
      prev = size
    }
  })
})
