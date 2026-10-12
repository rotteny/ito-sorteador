import { describe, expect, it } from 'vitest'
import { decksFixture, decksWithoutOriginal } from './__fixtures__/decks'
import { availableMode, currentPool, drawTheme, initialDeckState, isModeAvailable, poolProgress } from './draw'
import { initialPersisted, sanitize } from './storage'
import { resolveCard } from './card'

describe('disponibilidade do modo original', () => {
  it('com o baralho carregado, os dois modos existem', () => {
    expect(isModeAvailable('original', decksFixture)).toBe(true)
    expect(availableMode('original', decksFixture)).toBe('original')
  })

  it('sem o baralho, o original cai para extras', () => {
    expect(isModeAvailable('original', decksWithoutOriginal)).toBe(false)
    expect(isModeAvailable('extras', decksWithoutOriginal)).toBe(true)
    expect(availableMode('original', decksWithoutOriginal)).toBe('extras')
  })

  it('sem o baralho, pool original é vazio e não sorteia (sem quebrar)', () => {
    const s = { ...initialDeckState, mode: 'original' as const }
    expect(currentPool(s, decksWithoutOriginal)).toEqual([])
    expect(poolProgress(s, decksWithoutOriginal)).toEqual({ used: 0, size: 0 })
    expect(drawTheme(s, decksWithoutOriginal)).toBeNull()
    expect(resolveCard({ mode: 'original', id: 'o-1' }, decksWithoutOriginal)).toBeNull()
  })
})

describe('sanitize com e sem o baralho original', () => {
  const saved = {
    deck: { mode: 'original', sel: [], usedOrig: ['o-1', 'o-2', 'velho'], usedExtra: ['cinema-1'], round: 5 },
    screen: 'card',
    current: { mode: 'original', id: 'o-2' },
  }

  it('estado vazio abre no original quando ele existe', () => {
    expect(sanitize(null, decksFixture)).toEqual(initialPersisted)
    expect(sanitize(null, decksFixture).deck.mode).toBe('original')
  })

  it('estado vazio abre direto nos extras quando o original não existe', () => {
    expect(sanitize(null, decksWithoutOriginal).deck.mode).toBe('extras')
  })

  it('original carregado: mantém o modo salvo, a carta atual e filtra ids que sumiram', () => {
    const s = sanitize(saved, decksFixture)
    expect(s.deck.mode).toBe('original')
    expect(s.deck.usedOrig).toEqual(['o-1', 'o-2'])
    expect(s.screen).toBe('card')
    expect(s.current).toEqual({ mode: 'original', id: 'o-2' })
  })

  it('modo salvo original + arquivo ausente: cai para extras e volta para a home', () => {
    const s = sanitize(saved, decksWithoutOriginal)
    expect(s.deck.mode).toBe('extras')
    expect(s.screen).toBe('home')
    expect(s.current).toBeNull()
    expect(s.deck.usedExtra).toEqual(['cinema-1'])
  })

  it('arquivo ausente não apaga o progresso do original', () => {
    const s = sanitize(saved, decksWithoutOriginal)
    expect(s.deck.usedOrig).toEqual(['o-1', 'o-2', 'velho'])
    // quando o arquivo voltar, o progresso é reaproveitado (e só aí os ids inválidos somem)
    expect(sanitize(s, decksFixture).deck.usedOrig).toEqual(['o-1', 'o-2'])
  })
})
