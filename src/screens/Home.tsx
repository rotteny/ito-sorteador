import type { Category } from '../data/types'
import type { CardView } from '../lib/card'
import type { Mode, PoolProgress } from '../lib/draw'
import { AuthorCredit } from '../components/AuthorCredit'
import { Brand } from '../components/Brand'
import { CategoryFilter } from '../components/CategoryFilter'
import { DrawFooter } from '../components/DrawFooter'
import { ModeToggle } from '../components/ModeToggle'
import { OriginalIntro } from '../components/OriginalIntro'
import { ResumeCardButton } from '../components/ResumeCardButton'
import './Home.css'

interface HomeProps {
  mode: Mode
  /** Sem o baralho original, o seletor some e a Home mostra só os temas extras. */
  originalAvailable: boolean
  categories: readonly Category[]
  selected: readonly string[]
  progress: PoolProgress
  /** Carta atual do modo/filtro selecionados; null esconde o "Ver tema atual". */
  currentCard: CardView | null
  onModeChange: (mode: Mode) => void
  onToggleCategory: (id: string) => void
  onSelectAll: () => void
  onReset: () => void
  onResume: () => void
  onDraw: () => void
}

/** Tela inicial: escolha do baralho (quando há o original), filtro e botão de sortear fixo embaixo. */
export function Home(props: HomeProps) {
  const { mode, originalAvailable, categories, selected, progress, currentCard } = props
  return (
    <main className="home">
      <Brand />
      <div className="home__body">
        {originalAvailable && <ModeToggle mode={mode} onChange={props.onModeChange} />}
        {mode === 'original' ? (
          <OriginalIntro total={progress.size} />
        ) : (
          <CategoryFilter
            categories={categories}
            selected={selected}
            poolSize={progress.size}
            onToggle={props.onToggleCategory}
            onSelectAll={props.onSelectAll}
          />
        )}
      </div>
      <DrawFooter
        progress={progress}
        resetScope={{ mode, filtered: selected.length > 0 }}
        secondaryAction={currentCard && <ResumeCardButton card={currentCard} onResume={props.onResume} />}
        onReset={props.onReset}
        onDraw={props.onDraw}
      />
      <AuthorCredit />
    </main>
  )
}
