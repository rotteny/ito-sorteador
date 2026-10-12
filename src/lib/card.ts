import type { Decks } from '../data/types'
import type { DrawnRef } from './draw'

export const ORIGINAL_LABEL = 'Baralho original'
export const ORIGINAL_COLOR = '#3D3D40'

/** Tudo que a tela da carta precisa para renderizar. */
export interface CardView {
  key: string
  label: string
  color: string
  texto: string
  min: string
  max: string
}

export function resolveCard(ref: DrawnRef, decks: Decks): CardView | null {
  if (ref.mode === 'original') {
    const t = decks.original?.find((x) => x.id === ref.id)
    if (!t) return null
    return { key: t.id, label: ORIGINAL_LABEL, color: ORIGINAL_COLOR, texto: t.texto, min: t.min, max: t.max }
  }
  const t = decks.extras.find((x) => x.id === ref.id)
  if (!t) return null
  const cat = decks.categories.find((c) => c.id === t.categoria)
  return {
    key: t.id,
    label: cat?.label ?? 'Temas extras',
    color: cat?.color ?? ORIGINAL_COLOR,
    texto: t.texto,
    min: t.min,
    max: t.max,
  }
}
