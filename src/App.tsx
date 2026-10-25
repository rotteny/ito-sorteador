import type { Decks } from './data/types'
import { useDecks } from './hooks/useDecks'
import { useSorteio } from './hooks/useSorteio'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ShuffleOverlay } from './components/ShuffleOverlay'
import { SoundToggle } from './components/SoundToggle'
import { useDrawFlow } from './hooks/useDrawFlow'
import { useSoundPref } from './hooks/useSoundPref'
import { Card } from './screens/Card'
import { Home } from './screens/Home'

export function App() {
  const decks = useDecks()
  // Instante do fetch do baralho original: só o fundo do app, sem conteúdo que depois mudaria.
  return (
    <div className="app" aria-busy={decks === null}>
      {decks && <Sorteador decks={decks} />}
    </div>
  )
}

/** Sorteador com os baralhos já resolvidos (exportado para os testes de interface). */
export function Sorteador({ decks }: { decks: Decks }) {
  const s = useSorteio(decks)
  const sound = useSoundPref()
  const flow = useDrawFlow({ draw: s.draw, shuffleTexts: s.poolTexts, muted: sound.muted })
  const soundToggle = <SoundToggle muted={sound.muted} onToggle={sound.toggle} />

  return (
    <>
      {s.screen === 'card' && s.card ? (
        <Card
          card={s.card}
          round={s.round}
          progress={s.progress}
          wrapped={s.wrapped}
          soundToggle={soundToggle}
          onHome={s.goHome}
          onDraw={flow.ask}
        />
      ) : (
        <Home
          mode={s.mode}
          originalAvailable={s.originalAvailable}
          categories={decks.categories}
          selected={s.sel}
          progress={s.progress}
          currentCard={s.card}
          soundToggle={soundToggle}
          onModeChange={s.setMode}
          onToggleCategory={s.toggleCategory}
          onSelectAll={s.selectAll}
          onReset={s.reset}
          onResume={s.resume}
          onDraw={flow.ask}
        />
      )}
      <ConfirmDialog
        open={flow.confirming}
        title="Sortear um tema?"
        message="Vamos embaralhar e revelar a próxima carta do baralho."
        confirmLabel="Sortear"
        onConfirm={flow.confirm}
        onCancel={flow.cancel}
      />
      {flow.shuffling && <ShuffleOverlay text={flow.frameText} />}
    </>
  )
}
