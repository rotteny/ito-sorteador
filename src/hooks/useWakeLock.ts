import { useEffect } from 'react'

/** Mantém a tela acesa enquanto `active` for true, se o navegador suportar. Erros são ignorados. */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const acquire = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) void lock.release().catch(() => undefined)
        else sentinel = lock
      } catch {
        /* sem permissão, aba oculta ou bateria fraca: segue sem wake lock */
      }
    }
    // O sistema libera o lock quando a aba some; pede de novo ao voltar.
    const onVisible = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      void sentinel?.release().catch(() => undefined)
    }
  }, [active])
}
