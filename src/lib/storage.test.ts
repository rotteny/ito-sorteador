import { describe, expect, it } from 'vitest'
import { decksFixture } from './__fixtures__/decks'
import { initialPersisted, sanitize } from './storage'

describe('sanitize', () => {
  it('cai no estado inicial com lixo', () => {
    expect(sanitize(null, decksFixture)).toEqual(initialPersisted)
    expect(sanitize('x', decksFixture)).toEqual(initialPersisted)
  })

  it('descarta ids que não existem mais e restaura a carta atual', () => {
    const s = sanitize(
      {
        deck: { mode: 'extras', sel: ['cinema', 'nope'], usedOrig: ['o-1', 'velho'], usedExtra: ['cinema-1'], round: 3 },
        screen: 'card',
        current: { mode: 'extras', id: 'cinema-1' },
      },
      decksFixture,
    )
    expect(s.deck).toEqual({ mode: 'extras', sel: ['cinema'], usedOrig: ['o-1'], usedExtra: ['cinema-1'], round: 3 })
    expect(s.screen).toBe('card')
  })

  it('volta para a home se a carta atual sumiu', () => {
    const s = sanitize({ screen: 'card', current: { mode: 'original', id: 'sumiu' } }, decksFixture)
    expect(s.screen).toBe('home')
    expect(s.current).toBeNull()
  })
})
