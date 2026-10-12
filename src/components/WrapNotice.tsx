import './WrapNotice.css'

/** Aviso exibido quando o baralho acabou e o sorteio recomeçou. */
export function WrapNotice() {
  return (
    <p className="wrap-notice mono" role="status">
      Baralho completo! Recomeçamos do zero.
    </p>
  )
}
