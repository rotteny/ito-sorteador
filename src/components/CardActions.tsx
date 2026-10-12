import './CardActions.css'

interface CardActionsProps {
  onChangeDeck: () => void
  onDraw: () => void
}

/** Botões da tela da carta: voltar à escolha de baralho ou sortear de novo. */
export function CardActions({ onChangeDeck, onDraw }: CardActionsProps) {
  return (
    <div className="card-actions">
      <button type="button" className="btn-pill" onClick={onChangeDeck}>
        Trocar baralho
      </button>
      <button type="button" className="btn-pill btn-pill--solid" onClick={onDraw}>
        Sortear outro
      </button>
    </div>
  )
}
