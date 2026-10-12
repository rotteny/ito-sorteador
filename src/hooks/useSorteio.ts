import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Decks } from '../data/types'
import { resolveCard, type CardView } from '../lib/card'
import {
  availableMode,
  drawTheme,
  isModeAvailable,
  poolProgress,
  resetCurrentPool,
  toggleCategory as toggleSel,
  type Mode,
  type PoolProgress,
} from '../lib/draw'
import { loadState, saveState, type PersistedState, type Screen } from '../lib/storage'

export interface Sorteio {
  screen: Screen
  mode: Mode
  /** false quando o baralho original não está disponível: só existem os extras. */
  originalAvailable: boolean
  sel: readonly string[]
  progress: PoolProgress
  round: number
  wrapped: boolean
  card: CardView | null
  setMode: (mode: Mode) => void
  toggleCategory: (id: string) => void
  selectAll: () => void
  draw: () => void
  reset: () => void
  goHome: () => void
}

/**
 * Estado do sorteador + persistência em localStorage. Sem nada de JSX.
 * Os baralhos são lidos uma vez na montagem — monte só depois que eles estiverem resolvidos.
 */
export function useSorteio(decks: Decks): Sorteio {
  const [state, setState] = useState<PersistedState>(() => loadState(decks))
  const [wrapped, setWrapped] = useState(false)

  useEffect(() => saveState(state), [state])

  const allCategoryIds = useMemo(() => decks.categories.map((c) => c.id), [decks])

  const setDeck = useCallback(
    (fn: (s: PersistedState) => PersistedState['deck']) => setState((s) => ({ ...s, deck: fn(s) })),
    [],
  )

  const draw = useCallback(() => {
    const outcome = drawTheme(state.deck, decks)
    if (!outcome) return
    navigator.vibrate?.(15)
    setWrapped(outcome.wrapped)
    setState({ deck: outcome.state, current: outcome.drawn, screen: 'card' })
  }, [state.deck, decks])

  return {
    screen: state.screen,
    mode: state.deck.mode,
    originalAvailable: isModeAvailable('original', decks),
    sel: state.deck.sel,
    progress: poolProgress(state.deck, decks),
    round: state.deck.round,
    wrapped,
    card: state.current ? resolveCard(state.current, decks) : null,
    setMode: (mode) => setDeck((s) => ({ ...s.deck, mode: availableMode(mode, decks) })),
    toggleCategory: (id) => setDeck((s) => ({ ...s.deck, sel: toggleSel(s.deck.sel, id, allCategoryIds) })),
    selectAll: () => setDeck((s) => ({ ...s.deck, sel: [] })),
    draw,
    reset: () => setDeck((s) => resetCurrentPool(s.deck, decks)),
    goHome: () => {
      setWrapped(false)
      setState((s) => ({ ...s, screen: 'home' }))
    },
  }
}
