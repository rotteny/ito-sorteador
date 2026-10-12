import type { CSSProperties } from 'react'
import type { CardView } from '../lib/card'
import { titleSize } from '../lib/titleSize'
import { CardWave } from './CardWave'
import { Scale } from './Scale'
import './ThemeCard.css'

interface ThemeCardProps {
  card: CardView
  round: number
}

/** A carta de tema: onda, categoria, rodada, título, régua 1–100 e dica. */
export function ThemeCard({ card, round }: ThemeCardProps) {
  const accent = { '--accent': card.color } as CSSProperties
  return (
    <article className="theme-card" style={accent} aria-labelledby="theme-card-title">
      <CardWave />
      <div className="theme-card__meta mono">
        <span className="theme-card__label">
          <span className="theme-card__dot" aria-hidden="true" />
          {card.label}
        </span>
        <span className="theme-card__round">Rodada {round}</span>
      </div>
      <div className="theme-card__body">
        <h2 id="theme-card-title" className={`theme-card__title theme-card__title--${titleSize(card.texto)}`}>
          {card.texto}
        </h2>
        <Scale min={card.min} max={card.max} />
      </div>
      <div className="theme-card__hint mono">
        <span className="theme-card__rule" aria-hidden="true" />
        <span>descreva seu número sem dizê-lo</span>
        <span className="theme-card__rule" aria-hidden="true" />
      </div>
    </article>
  )
}
