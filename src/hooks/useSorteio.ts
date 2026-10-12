import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Decks } from '../data/types'
import { resolveCard, type CardView } from '../lib/card'
import { resetWithCurrent, visibleCurrent, withCurrent } from '../lib/current'
import {
  availableMode,
  drawTheme,
  isModeAvailable,
  poolProgress,
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
  /** Carta atual do modo/filtro selecionados (null quando não há ou está escondida). */
  card: CardView | null
  setMode: (mode: Mode) => void
  toggleCategory: (id: string) => void
  selectAll: () => void
  draw: () => void
  reset: () => void
  /** Volta para a carta atual sem sortear: mesma rodada, mesma contagem. */
  resume: () => void
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
    setState((s) => ({ deck: outcome.state, current: withCurrent(s.current, outcome.drawn), screen: 'card' }))
  }, [state.deck, decks])

  const currentRef = visibleCurrent(state.deck, state.current, decks)

  return {
    screen: state.screen,
    mode: state.deck.mode,
    originalAvailable: isModeAvailable('original', decks),
    sel: state.deck.sel,
    progress: poolProgress(state.deck, decks),
    round: state.deck.round,
    wrapped,
    card: currentRef ? resolveCard(currentRef, decks) : null,
    setMode: (mode) => setDeck((s) => ({ ...s.deck, mode: availableMode(mode, decks) })),
    toggleCategory: (id) => setDeck((s) => ({ ...s.deck, sel: toggleSel(s.deck.sel, id, allCategoryIds) })),
    selectAll: () => setDeck((s) => ({ ...s.deck, sel: [] })),
    draw,
    reset: () => setState((s) => ({ ...s, ...resetWithCurrent(s.deck, s.current, decks) })),
    resume: () => {
      if (!currentRef) return
      setWrapped(false)
      setState((s) => ({ ...s, screen: 'card' }))
    },
    goHome: () => {
      setWrapped(false)
      setState((s) => ({ ...s, screen: 'home' }))
    },
  }
}
