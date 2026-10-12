import { useEffect, useRef, type ReactNode } from 'react'
import type { PoolProgress } from '../lib/draw'
import { resetConfirmMessage, type ResetScope } from '../lib/copy'
import { useConfirm } from '../hooks/useConfirm'
import { ConfirmDialog } from './ConfirmDialog'
import { RestartIcon } from './icons'
import './DrawFooter.css'

interface DrawFooterProps {
  progress: PoolProgress
  /** Modo e filtro atuais: o texto da confirmação diz o que exatamente será zerado. */
  resetScope: ResetScope
  /** Ação extra acima de "Sortear tema" (ex.: voltar à carta atual). */
  secondaryAction?: ReactNode
  onReset: () => void
  onDraw: () => void
}

/** Rodapé fixo da Home: progresso, "Recomeçar" (com confirmação) e "Sortear tema". */
export function DrawFooter({ progress, resetScope, secondaryAction, onReset, onDraw }: DrawFooterProps) {
  const drawRef = useRef<HTMLButtonElement>(null)
  const focusDrawAfterReset = useRef(false)
  const reset = useConfirm(() => {
    focusDrawAfterReset.current = true
    onReset()
  })

  // Depois de recomeçar, o botão "Recomeçar" fica desabilitado: o foco segue para "Sortear tema".
  useEffect(() => {
    if (reset.open || !focusDrawAfterReset.current) return
    focusDrawAfterReset.current = false
    drawRef.current?.focus()
  }, [reset.open])

  return (
    <footer className="draw-footer">
      <div className="draw-footer__status">
        <span className="mono draw-footer__count">
          Sorteadas {progress.used}/{progress.size}
        </span>
        <button
          type="button"
          className="draw-footer__reset"
          aria-haspopup="dialog"
          onClick={reset.ask}
          disabled={progress.used === 0}
        >
          <RestartIcon />
          Recomeçar
        </button>
      </div>
      {secondaryAction}
      <button
        ref={drawRef}
        type="button"
        className="btn-pill btn-pill--solid btn-pill--lg"
        onClick={onDraw}
        disabled={progress.size === 0}
      >
        Sortear tema
      </button>
      <ConfirmDialog
        open={reset.open}
        title="Recomeçar o baralho?"
        message={resetConfirmMessage(progress.used, resetScope)}
        confirmLabel="Recomeçar"
        onConfirm={reset.confirm}
        onCancel={reset.cancel}
      />
    </footer>
  )
}
