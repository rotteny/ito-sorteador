import { useEffect } from 'react'

const isStandalone = () =>
  (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

/**
 * Trava em retrato via Screen Orientation API, só no app instalado (standalone).
 * Fora disso o navegador rejeita (ou não tem a API): o erro é ignorado e o aviso em CSS cobre o resto.
 */
export function useOrientationLock(): void {
  useEffect(() => {
    if (!isStandalone()) return
    try {
      const lock = (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> } | undefined)?.lock
      void lock?.call(screen.orientation, 'portrait')?.catch(() => undefined)
    } catch {
      /* sem suporte: segue sem travar */
    }
  }, [])
}
