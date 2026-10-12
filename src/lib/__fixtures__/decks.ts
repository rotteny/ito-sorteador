import type { Decks, ExtraTheme, OriginalTheme } from '../../data/types'

/** Baralhos sintéticos para os testes de sorteio (independentes dos JSONs reais). */
export const originalFixture: OriginalTheme[] = Array.from({ length: 100 }, (_, i) => ({
  id: `o-${i + 1}`,
  texto: `Tema ${i + 1}`,
  min: 'pouco',
  max: 'muito',
}))

const cats = ['cinema', 'comida', 'turismo'] as const

export const extrasFixture: ExtraTheme[] = cats.flatMap((c, ci) =>
  Array.from({ length: 4 + ci }, (_, i) => ({
    id: `${c}-${i + 1}`,
    categoria: c,
    texto: `${c} ${i + 1}`,
    min: 'min',
    max: 'max',
  })),
)

export const decksFixture: Decks = {
  original: originalFixture,
  extras: extrasFixture,
  categories: cats.map((id) => ({ id, label: id, color: '#000000', fg: '#FFFFFF' })),
}

/** Gerador pseudoaleatório determinístico (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Mesmos baralhos, mas sem o original (arquivo ausente ou inválido no servidor). */
export const decksWithoutOriginal: Decks = { ...decksFixture, original: null }
