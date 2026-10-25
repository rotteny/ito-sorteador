import type { ReactNode } from 'react'
import type { PoolProgress } from '../lib/draw'
import { ChevronLeftIcon } from './icons'
import './CardHeader.css'

interface CardHeaderProps {
  progress: PoolProgress
  /** Ação extra ao lado do progresso (ex.: botão de mudo). */
  trailing?: ReactNode
  onBack: () => void
}

/** Topo da tela da carta: voltar, logo e progresso do baralho. */
export function CardHeader({ progress, trailing, onBack }: CardHeaderProps) {
  return (
    <header className="card-header">
      <button type="button" className="card-header__back" onClick={onBack} aria-label="Voltar ao início">
        <ChevronLeftIcon />
      </button>
      <span className="card-header__logo" aria-hidden="true">
        ito
      </span>
      <div className="card-header__end">
        <span className="card-header__progress mono">
          <span className="visually-hidden">Sorteadas </span>
          {progress.used}/{progress.size}
        </span>
        {trailing}
      </div>
    </header>
  )
}
