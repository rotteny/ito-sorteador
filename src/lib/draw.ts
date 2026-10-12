import type { Decks, ExtraTheme, OriginalTheme } from '../data/types'

export type Mode = 'original' | 'extras'

/** Estado persistível do sorteio (sem nada de UI). */
export interface DeckState {
  mode: Mode
  /** Categorias selecionadas. Vazio = "Todos". */
  sel: string[]
  usedOrig: string[]
  usedExtra: string[]
  round: number
}

/** Referência à carta sorteada — o texto é resolvido a partir dos baralhos. */
export interface DrawnRef {
  mode: Mode
  id: string
}

export interface DrawOutcome {
  state: DeckState
  drawn: DrawnRef
  /** true quando o pool acabou e recomeçou neste sorteio. */
  wrapped: boolean
}

export type RandomFn = () => number

export const initialDeckState: DeckState = {
  mode: 'original',
  sel: [],
  usedOrig: [],
  usedExtra: [],
  round: 0,
}

interface Identified {
  id: string
}

/** O modo original só existe quando o baralho foi carregado. */
export function isModeAvailable(mode: Mode, decks: Decks): boolean {
  return mode === 'extras' || decks.original !== null
}

/** Modo efetivo: se o pedido não está disponível, cai para os extras. */
export function availableMode(mode: Mode, decks: Decks): Mode {
  return isModeAvailable(mode, decks) ? mode : 'extras'
}

export function extrasPool(themes: readonly ExtraTheme[], sel: readonly string[]): ExtraTheme[] {
  return sel.length === 0 ? [...themes] : themes.filter((t) => sel.includes(t.categoria))
}

export function currentPool(state: DeckState, decks: Decks): readonly (OriginalTheme | ExtraTheme)[] {
  return state.mode === 'original' ? (decks.original ?? []) : extrasPool(decks.extras, state.sel)
}

function usedOf(state: DeckState): string[] {
  return state.mode === 'original' ? state.usedOrig : state.usedExtra
}

function withUsed(state: DeckState, used: string[]): DeckState {
  return state.mode === 'original' ? { ...state, usedOrig: used } : { ...state, usedExtra: used }
}

export interface PoolProgress {
  used: number
  size: number
}

export function poolProgress(state: DeckState, decks: Decks): PoolProgress {
  const pool = currentPool(state, decks)
  const used = new Set(usedOf(state))
  return { size: pool.length, used: pool.filter((t) => used.has(t.id)).length }
}

/**
 * Liga/desliga uma categoria. Selecionar todas equivale a "Todos" (seleção vazia),
 * como no mockup.
 */
export function toggleCategory(sel: readonly string[], id: string, allIds: readonly string[]): string[] {
  const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
  return allIds.length > 0 && allIds.every((c) => next.includes(c)) ? [] : next
}

interface Pick<T> {
  item: T
  used: string[]
  wrapped: boolean
}

/** Sorteia um item do pool que ainda não saiu; se acabou, libera só os ids do pool e recomeça. */
export function pickFrom<T extends Identified>(
  pool: readonly T[],
  used: readonly string[],
  random: RandomFn = Math.random,
): Pick<T> | null {
  if (pool.length === 0) return null
  let usedNow = [...used]
  let avail = pool.filter((t) => !usedNow.includes(t.id))
  let wrapped = false
  if (avail.length === 0) {
    const poolIds = new Set(pool.map((t) => t.id))
    usedNow = usedNow.filter((id) => !poolIds.has(id))
    avail = [...pool]
    wrapped = true
  }
  const index = Math.min(avail.length - 1, Math.floor(random() * avail.length))
  const item = avail[index] as T
  return { item, used: [...usedNow, item.id], wrapped }
}

export function drawTheme(state: DeckState, decks: Decks, random: RandomFn = Math.random): DrawOutcome | null {
  const pick = pickFrom(currentPool(state, decks), usedOf(state), random)
  if (!pick) return null
  return {
    state: { ...withUsed(state, pick.used), round: state.round + 1 },
    drawn: { mode: state.mode, id: pick.item.id },
    wrapped: pick.wrapped,
  }
}

/** "Recomeçar": libera só as cartas do pool atual e zera a rodada. */
export function resetCurrentPool(state: DeckState, decks: Decks): DeckState {
  const poolIds = new Set(currentPool(state, decks).map((t) => t.id))
  return { ...withUsed(state, usedOf(state).filter((id) => !poolIds.has(id))), round: 0 }
}
