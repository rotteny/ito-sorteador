import './ShuffleOverlay.css'

interface ShuffleOverlayProps {
  text: string
}

/** Camada do embaralhamento: o tema "passa" rápido antes da revelação. Leitor de tela ouve só o status. */
export function ShuffleOverlay({ text }: ShuffleOverlayProps) {
  return (
    <div className="shuffle-overlay">
      <p className="visually-hidden" role="status">
        Sorteando o tema…
      </p>
      <div className="shuffle-overlay__card" aria-hidden="true">
        <span className="shuffle-overlay__label mono">Sorteando…</span>
        <span key={text} className="shuffle-overlay__text">
          {text}
        </span>
      </div>
    </div>
  )
}
