import { useState } from 'react'

export interface ConfirmState {
  open: boolean
  ask: () => void
  cancel: () => void
  confirm: () => void
}

/** Estado de uma confirmação: abrir, cancelar ou confirmar (executa a ação e fecha). */
export function useConfirm(action: () => void): ConfirmState {
  const [open, setOpen] = useState(false)
  return {
    open,
    ask: () => setOpen(true),
    cancel: () => setOpen(false),
    confirm: () => {
      setOpen(false)
      action()
    },
  }
}
