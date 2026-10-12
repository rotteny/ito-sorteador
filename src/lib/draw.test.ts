import { describe, expect, it } from 'vitest'
import { decksFixture, seededRandom } from './__fixtures__/decks'
import {
  currentPool,
  drawTheme,
  extrasPool,
  initialDeckState,
  pickFrom,
  poolProgress,
  resetCurrentPool,
  toggleCategory,
  type DeckState,
} from './draw'

const allCats = decksFixture.categories.map((c) => c.id)

function drawN(state: DeckState, n: number, seed = 1) {
  const random = seededRandom(seed)
  const ids: string[] = []
  const wraps: boolean[] = []
  let s = state
  for (let i = 0; i < n; i++) {
    const out = drawTheme(s, decksFixture, random)
    if (!out) throw new Error('pool vazio')
    ids.push(out.drawn.id)
    wraps.push(out.wrapped)
    s = out.state
  }
  return { state: s, ids, wraps }
}

describe('baralho original', () => {
  it('sorteia as 100 cartas sem repetir', () => {
    const { ids, wraps, state } = drawN(initialDeckState, 100)
    expect(new Set(ids).size).toBe(100)
    expect(wraps.every((w) => !w)).toBe(true)
    expect(state.usedOrig).toHaveLength(100)
    expect(state.round).toBe(100)
    expect(poolProgress(state, decksFixture)).toEqual({ used: 100, size: 100 })
  })

  it('o 101º sorteio marca wrapped e recomeça do zero', () => {
    const { state } = drawN(initialDeckState, 100)
    const out = drawTheme(state, decksFixture, seededRandom(7))
    expect(out?.wrapped).toBe(true)
    expect(out?.state.usedOrig).toEqual([out?.drawn.id])
    expect(out?.state.round).toBe(101)
  })

  it('não mexe nos usados dos extras', () => {
    const start: DeckState = { ...initialDeckState, usedExtra: ['cinema-1'] }
    const { state } = drawN(start, 3)
    expect(state.usedExtra).toEqual(['cinema-1'])
  })
})

describe('temas extras e filtro', () => {
  const extras: DeckState = { ...initialDeckState, mode: 'extras' }

  it('"Todos" é a seleção vazia e usa o pool inteiro', () => {
    expect(extrasPool(decksFixture.extras, [])).toHaveLength(decksFixture.extras.length)
    expect(currentPool(extras, decksFixture)).toHaveLength(decksFixture.extras.length)
  })

  it('o filtro de categoria limita o pool', () => {
    const s: DeckState = { ...extras, sel: ['comida'] }
    const pool = currentPool(s, decksFixture)
    expect(pool).toHaveLength(5)
    expect(pool.every((t) => 'categoria' in t && t.categoria === 'comida')).toBe(true)

    const { ids } = drawN(s, 5)
    expect(ids.every((id) => id.startsWith('comida-'))).toBe(true)
    expect(new Set(ids).size).toBe(5)
  })

  it('selecionar todas as categorias equivale a "Todos"', () => {
    let sel: string[] = []
    sel = toggleCategory(sel, 'cinema', allCats)
    sel = toggleCategory(sel, 'comida', allCats)
    expect(sel).toEqual(['cinema', 'comida'])
    sel = toggleCategory(sel, 'turismo', allCats)
    expect(sel).toEqual([])
  })

  it('desmarcar uma categoria a remove da seleção', () => {
    expect(toggleCategory(['cinema', 'comida'], 'cinema', allCats)).toEqual(['comida'])
  })

  it('ao esgotar o pool filtrado, recomeça só ele e preserva os usados de fora', () => {
    const s: DeckState = { ...extras, sel: ['cinema'], usedExtra: ['turismo-1'] }
    const { state } = drawN(s, 4)
    const out = drawTheme(state, decksFixture, seededRandom(3))
    expect(out?.wrapped).toBe(true)
    expect(out?.state.usedExtra).toEqual(['turismo-1', out?.drawn.id])
  })
})

describe('Recomeçar', () => {
  it('zera só o pool atual (original)', () => {
    const s: DeckState = { ...initialDeckState, usedOrig: ['o-1', 'o-2'], usedExtra: ['cinema-1'], round: 2 }
    const r = resetCurrentPool(s, decksFixture)
    expect(r.usedOrig).toEqual([])
    expect(r.usedExtra).toEqual(['cinema-1'])
    expect(r.round).toBe(0)
  })

  it('zera só as categorias filtradas (extras)', () => {
    const s: DeckState = {
      ...initialDeckState,
      mode: 'extras',
      sel: ['cinema'],
      usedOrig: ['o-9'],
      usedExtra: ['cinema-1', 'cinema-2', 'comida-1'],
    }
    const r = resetCurrentPool(s, decksFixture)
    expect(r.usedExtra).toEqual(['comida-1'])
    expect(r.usedOrig).toEqual(['o-9'])
  })
})

describe('pickFrom', () => {
  it('devolve null para pool vazio', () => {
    expect(pickFrom([], [], () => 0)).toBeNull()
  })

  it('aguenta random() === 1 sem estourar o índice', () => {
    const pick = pickFrom([{ id: 'a' }, { id: 'b' }], [], () => 0.9999999999)
    expect(pick?.item.id).toBe('b')
  })
})
