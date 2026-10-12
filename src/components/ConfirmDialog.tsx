import { useEffect, useId, useRef, type MouseEvent, type SyntheticEvent } from 'react'
import './ConfirmDialog.css'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmação modal sobre o `<dialog>` nativo: `showModal()` já prende o foco, trata Esc e
 * marca o resto da página como inerte. Clicar no fundo cancela. Ao abrir, o foco vai para
 * "Cancelar" (a opção segura); ao fechar, volta para quem abriu, se ainda der para focar.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef(open)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    openRef.current = open
    const dialog = dialogRef.current
    if (!open || !dialog) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!dialog.open) dialog.showModal()
    cancelRef.current?.focus()
    return () => {
      if (dialog.open) dialog.close()
      if (opener?.isConnected && !opener.matches(':disabled')) opener.focus()
    }
  }, [open])

  // Esc: o navegador dispara "cancel"; deixamos o estado do pai decidir o fechamento.
  const handleCancelEvent = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault()
    onCancel()
  }

  // Rede de segurança: se o navegador fechar por conta própria (Esc repetido), sincroniza o pai.
  const handleClose = () => {
    if (openRef.current) onCancel()
  }

  // O conteúdo ocupa o dialog inteiro; clique cujo alvo é o próprio <dialog> veio do ::backdrop.
  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancelEvent}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className="confirm-dialog__body">
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        <p id={messageId} className="confirm-dialog__message">
          {message}
        </p>
        <div className="confirm-dialog__actions">
          <button ref={cancelRef} type="button" className="btn-pill" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn-pill btn-pill--solid" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
