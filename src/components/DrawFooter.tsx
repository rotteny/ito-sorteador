import type { PoolProgress } from '../lib/draw'
import { RestartIcon } from './icons'
import './DrawFooter.css'

interface DrawFooterProps {
  progress: PoolProgress
  onReset: () => void
  onDraw: () => void
}

/** Rodapé fixo da Home: progresso, "Recomeçar" e "Sortear tema". */
export function DrawFooter({ progress, onReset, onDraw }: DrawFooterProps) {
  return (
    <footer className="draw-footer">
      <div className="draw-footer__status">
        <span className="mono draw-footer__count">
          Sorteadas {progress.used}/{progress.size}
        </span>
        <button type="button" className="draw-footer__reset" onClick={onReset} disabled={progress.used === 0}>
          <RestartIcon />
          Recomeçar
        </button>
      </div>
      <button
        type="button"
        className="btn-pill btn-pill--solid btn-pill--lg"
        onClick={onDraw}
        disabled={progress.size === 0}
      >
        Sortear tema
      </button>
    </footer>
  )
}
