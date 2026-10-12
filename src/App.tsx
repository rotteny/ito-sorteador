import type { Decks } from './data/types'
import { useDecks } from './hooks/useDecks'
import { useSorteio } from './hooks/useSorteio'
import { Card } from './screens/Card'
import { Home } from './screens/Home'

export function App() {
  const decks = useDecks()
  // Instante do fetch do baralho original: só o fundo do app, sem conteúdo que depois mudaria.
  return <div className="app" aria-busy={decks === null}>{decks && <Sorteador decks={decks} />}</div>
}

function Sorteador({ decks }: { decks: Decks }) {
  const s = useSorteio(decks)

  return s.screen === 'card' && s.card ? (
    <Card card={s.card} round={s.round} progress={s.progress} wrapped={s.wrapped} onHome={s.goHome} onDraw={s.draw} />
  ) : (
    <Home
      mode={s.mode}
      originalAvailable={s.originalAvailable}
      categories={decks.categories}
      selected={s.sel}
      progress={s.progress}
      onModeChange={s.setMode}
      onToggleCategory={s.toggleCategory}
      onSelectAll={s.selectAll}
      onReset={s.reset}
      onDraw={s.draw}
    />
  )
}
