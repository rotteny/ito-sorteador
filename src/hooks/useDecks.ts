import { useEffect, useState } from 'react'
import { buildDecks } from '../data'
import { fetchOriginalDeck } from '../data/original'
import type { Decks } from '../data/types'

/**
 * Carrega o baralho original em tempo de execução e devolve os baralhos prontos.
 * `null` enquanto o fetch não termina — o app espera esse instante curto em vez de
 * renderizar e depois trocar de modo (evita a UI piscar).
 */
export function useDecks(): Decks | null {
  const [decks, setDecks] = useState<Decks | null>(null)

  useEffect(() => {
    let active = true
    void fetchOriginalDeck().then((original) => {
      if (active) setDecks(buildDecks(original))
    })
    return () => {
      active = false
    }
  }, [])

  return decks
}
