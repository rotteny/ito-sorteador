import { describe, expect, it } from 'vitest'
import { decksFixture } from './__fixtures__/decks'
import { noCurrent, resetWithCurrent, visibleCurrent, withCurrent } from './current'
import { initialDeckState } from './draw'

const extras = { ...initialDeckState, mode: 'extras' as const }

describe('carta atual por modo', () => {
  it('guarda uma carta por modo sem apagar a do outro', () => {
    const c = withCurrent(withCurrent(noCurrent, { mode: 'extras', id: 'cinema-1' }), { mode: 'original', id: 'o-9' })
    expect(c).toEqual({ original: 'o-9', extras: 'cinema-1' })
  })

  it('só mostra a carta do modo selecionado', () => {
    const c = { original: null, extras: 'cinema-1' }
    expect(visibleCurrent(initialDeckState, c, decksFixture)).toBeNull()
    expect(visibleCurrent(extras, c, decksFixture)).toEqual({ mode: 'extras', id: 'cinema-1' })
  })

  it('esconde a carta de categoria fora do filtro', () => {
    const c = { original: null, extras: 'cinema-1' }
    expect(visibleCurrent({ ...extras, sel: ['comida'] }, c, decksFixture)).toBeNull()
    expect(visibleCurrent({ ...extras, sel: ['cinema'] }, c, decksFixture)).not.toBeNull()
  })

  it('Recomeçar limpa a carta atual do pool zerado e mantém a do outro modo', () => {
    const deck = { ...initialDeckState, usedOrig: ['o-1'], round: 1 }
    const r = resetWithCurrent(deck, { original: 'o-1', extras: 'cinema-1' }, decksFixture)
    expect(r.current).toEqual({ original: null, extras: 'cinema-1' })
    expect(r.deck.round).toBe(0)
    expect(r.deck.usedOrig).toEqual([])
  })

  it('Recomeçar filtrado não mexe na carta de categoria fora do filtro', () => {
    const deck = { ...extras, sel: ['comida'], usedExtra: ['cinema-1', 'comida-1'] }
    const r = resetWithCurrent(deck, { original: null, extras: 'cinema-1' }, decksFixture)
    expect(r.current.extras).toBe('cinema-1')
    expect(r.deck.usedExtra).toEqual(['cinema-1'])
  })
})
