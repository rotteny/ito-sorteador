import type { Category } from '../data/types'
import type { Mode, PoolProgress } from '../lib/draw'
import { Brand } from '../components/Brand'
import { CategoryFilter } from '../components/CategoryFilter'
import { DrawFooter } from '../components/DrawFooter'
import { ModeToggle } from '../components/ModeToggle'
import { OriginalIntro } from '../components/OriginalIntro'
import './Home.css'

interface HomeProps {
  mode: Mode
  /** Sem o baralho original, o seletor some e a Home mostra só os temas extras. */
  originalAvailable: boolean
  categories: readonly Category[]
  selected: readonly string[]
  progress: PoolProgress
  onModeChange: (mode: Mode) => void
  onToggleCategory: (id: string) => void
  onSelectAll: () => void
  onReset: () => void
  onDraw: () => void
}

/** Tela inicial: escolha do baralho (quando há o original), filtro e botão de sortear fixo embaixo. */
export function Home(props: HomeProps) {
  const { mode, originalAvailable, categories, selected, progress } = props
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
      <DrawFooter progress={progress} onReset={props.onReset} onDraw={props.onDraw} />
    </main>
  )
}
