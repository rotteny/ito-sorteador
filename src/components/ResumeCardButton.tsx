import type { CSSProperties } from 'react'
import type { CardView } from '../lib/card'
import './ResumeCardButton.css'

interface ResumeCardButtonProps {
  card: CardView
  onResume: () => void
}

/** Volta para a carta já sorteada sem sortear outra. A bolinha usa a cor da categoria. */
export function ResumeCardButton({ card, onResume }: ResumeCardButtonProps) {
  const vars = { '--resume-color': card.color } as CSSProperties
  return (
    <button type="button" className="btn-pill resume-card" style={vars} onClick={onResume}>
      <span className="resume-card__dot" aria-hidden="true" />
      Ver tema atual
      <span className="visually-hidden">: {card.label}</span>
    </button>
  )
}
