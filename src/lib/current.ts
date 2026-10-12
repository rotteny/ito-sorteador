import type { Decks } from '../data/types'
import { currentPool, resetCurrentPool, type DeckState, type DrawnRef, type Mode } from './draw'

/** Última carta sorteada de cada modo: trocar de baralho não apaga a do outro. */
export type CurrentByMode = Record<Mode, string | null>

export const noCurrent: CurrentByMode = { original: null, extras: null }

/**
 * Carta atual que vale para o modo e o filtro selecionados. Fica escondida (null) quando é de
 * outro modo ou de uma categoria fora do filtro.
 */
export function visibleCurrent(deck: DeckState, current: CurrentByMode, decks: Decks): DrawnRef | null {
  const id = current[deck.mode]
  if (!id || !currentPool(deck, decks).some((t) => t.id === id)) return null
  return { mode: deck.mode, id }
}

export function withCurrent(current: CurrentByMode, drawn: DrawnRef): CurrentByMode {
  return { ...current, [drawn.mode]: drawn.id }
}

/** "Recomeçar" confirmado: zera o pool atual e esquece a carta atual se ela fazia parte dele. */
export function resetWithCurrent(
  deck: DeckState,
  current: CurrentByMode,
  decks: Decks,
): { deck: DeckState; current: CurrentByMode } {
  const inPool = visibleCurrent(deck, current, decks) !== null
  return {
    deck: resetCurrentPool(deck, decks),
    current: inPool ? { ...current, [deck.mode]: null } : current,
  }
}
