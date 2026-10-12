import type { PoolProgress } from '../lib/draw'
import { ChevronLeftIcon } from './icons'
import './CardHeader.css'

interface CardHeaderProps {
  progress: PoolProgress
  onBack: () => void
}

/** Topo da tela da carta: voltar, logo e progresso do baralho. */
export function CardHeader({ progress, onBack }: CardHeaderProps) {
  return (
    <header className="card-header">
      <button type="button" className="card-header__back" onClick={onBack} aria-label="Voltar ao início">
        <ChevronLeftIcon />
      </button>
      <span className="card-header__logo" aria-hidden="true">
        ito
      </span>
      <span className="card-header__progress mono">
        <span className="visually-hidden">Sorteadas </span>
        {progress.used}/{progress.size}
      </span>
    </header>
  )
}
