import type { Decks } from '../data/types'
import { noCurrent, visibleCurrent, type CurrentByMode } from './current'
import { availableMode, initialDeckState, type DeckState, type Mode } from './draw'

const KEY = 'ito-sorteador:v1'

export type Screen = 'home' | 'card'

export interface PersistedState {
  deck: DeckState
  screen: Screen
  current: CurrentByMode
}

export const initialPersisted: PersistedState = { deck: initialDeckState, screen: 'home', current: noCurrent }

const isMode = (v: unknown): v is Mode => v === 'original' || v === 'extras'

/** `valid = null` = baralho não carregado: mantém os ids como vieram (só limpa o que não é string). */
function stringsIn(v: unknown, valid: ReadonlySet<string> | null): string[] {
  if (!Array.isArray(v)) return []
  return [...new Set(v.filter((x): x is string => typeof x === 'string' && (valid === null || valid.has(x))))]
}

/** Estado inicial já ajustado aos baralhos disponíveis. */
export function initialPersistedFor(decks: Decks): PersistedState {
  const mode = availableMode(initialPersisted.deck.mode, decks)
  return { ...initialPersisted, deck: { ...initialPersisted.deck, mode } }
}

/**
 * Valida o que veio do localStorage contra os baralhos atuais (ids podem mudar entre versões).
 * Sem o baralho original: o modo cai para extras e os ids usados do original ficam intactos,
 * para o progresso voltar quando o arquivo estiver disponível de novo.
 */
export function sanitize(raw: unknown, decks: Decks): PersistedState {
  if (typeof raw !== 'object' || raw === null) return initialPersistedFor(decks)
  const r = raw as Record<string, unknown>
  const d = (typeof r.deck === 'object' && r.deck !== null ? r.deck : {}) as Record<string, unknown>
  const origIds = decks.original ? new Set(decks.original.map((t) => t.id)) : null
  const extraIds = new Set(decks.extras.map((t) => t.id))
  const catIds = new Set(decks.categories.map((c) => c.id))

  const deck: DeckState = {
    mode: availableMode(isMode(d.mode) ? d.mode : initialDeckState.mode, decks),
    sel: stringsIn(d.sel, catIds),
    usedOrig: stringsIn(d.usedOrig, origIds),
    usedExtra: stringsIn(d.usedExtra, extraIds),
    round: typeof d.round === 'number' && Number.isInteger(d.round) && d.round >= 0 ? d.round : 0,
  }
  if (deck.sel.length === catIds.size) deck.sel = []

  const current = sanitizeCurrent(r.current, origIds, extraIds)
  const screen: Screen = r.screen === 'card' && visibleCurrent(deck, current, decks) ? 'card' : 'home'
  return { deck, screen, current }
}

/**
 * Aceita o formato atual (`{ original, extras }`) e o antigo (`{ mode, id }`, uma carta só).
 * Sem o baralho original carregado, a carta dele é mantida como veio.
 */
function sanitizeCurrent(
  raw: unknown,
  origIds: ReadonlySet<string> | null,
  extraIds: ReadonlySet<string>,
): CurrentByMode {
  if (typeof raw !== 'object' || raw === null) return noCurrent
  const c = raw as Record<string, unknown>
  const byMode: Record<string, unknown> = isMode(c.mode) ? { [c.mode]: c.id } : c
  const pick = (v: unknown, valid: ReadonlySet<string> | null) =>
    typeof v === 'string' && (valid === null || valid.has(v)) ? v : null
  return { original: pick(byMode.original, origIds), extras: pick(byMode.extras, extraIds) }
}

export function loadState(decks: Decks): PersistedState {
  try {
    const raw = localStorage.getItem(KEY)
    return sanitize(raw ? JSON.parse(raw) : null, decks)
  } catch {
    return initialPersistedFor(decks)
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* modo privado / cota cheia: segue sem persistir */
  }
}
