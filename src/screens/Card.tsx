import type { ReactNode } from 'react'
import { CardActions } from '../components/CardActions'
import { CardHeader } from '../components/CardHeader'
import { ThemeCard } from '../components/ThemeCard'
import { WrapNotice } from '../components/WrapNotice'
import { useWakeLock } from '../hooks/useWakeLock'
import type { CardView } from '../lib/card'
import type { PoolProgress } from '../lib/draw'
import './Card.css'

interface CardProps {
  card: CardView
  round: number
  progress: PoolProgress
  wrapped: boolean
  soundToggle: ReactNode
  onHome: () => void
  onDraw: () => void
}

/** Tela da carta sorteada. Mantém a tela acesa enquanto aberta. */
export function Card({ card, round, progress, wrapped, soundToggle, onHome, onDraw }: CardProps) {
  useWakeLock(true)
  return (
    <main className="card-screen">
      <CardHeader progress={progress} trailing={soundToggle} onBack={onHome} />
      {wrapped && <WrapNotice />}
      <div className="card-screen__stage" aria-live="polite">
        <ThemeCard key={`${round}-${card.key}`} card={card} round={round} />
      </div>
      <CardActions onChangeDeck={onHome} onDraw={onDraw} />
    </main>
  )
}
