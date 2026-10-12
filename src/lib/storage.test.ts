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
    expect(s.current).toEqual({ original: null, extras: 'cinema-1' })
  })

  it('lê o formato novo, uma carta atual por modo', () => {
    const s = sanitize(
      { deck: { mode: 'original' }, screen: 'home', current: { original: 'o-4', extras: 'comida-1', lixo: 1 } },
      decksFixture,
    )
    expect(s.current).toEqual({ original: 'o-4', extras: 'comida-1' })
  })

  it('não abre a carta se ela é de uma categoria fora do filtro', () => {
    const s = sanitize(
      { deck: { mode: 'extras', sel: ['cinema'] }, screen: 'card', current: { extras: 'comida-1' } },
      decksFixture,
    )
    expect(s.screen).toBe('home')
    expect(s.current.extras).toBe('comida-1')
  })

  it('volta para a home se a carta atual sumiu', () => {
    const s = sanitize({ screen: 'card', current: { mode: 'original', id: 'sumiu' } }, decksFixture)
    expect(s.screen).toBe('home')
    expect(s.current).toEqual({ original: null, extras: null })
  })
})
