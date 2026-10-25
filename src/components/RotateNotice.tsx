import { RotatePhoneIcon } from './icons'
import './RotateNotice.css'

/** Plano B da trava de retrato: só aparece (via CSS) em celular deitado e esconde o app. */
export function RotateNotice() {
  return (
    <div className="rotate-notice" role="alert">
      <RotatePhoneIcon size={44} />
      <p className="rotate-notice__text">Gire o celular para a vertical</p>
    </div>
  )
}
