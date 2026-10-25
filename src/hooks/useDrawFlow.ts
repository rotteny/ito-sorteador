import { useCallback, useEffect, useRef, useState } from 'react'
import { playReveal, playTick, unlockAudio } from '../lib/sound'

export const SHUFFLE_FRAMES = 14
const FIRST_DELAY_MS = 60
const DELAY_GROWTH_MS = 7

export interface DrawFlow {
  /** Dialog de confirmação aberto. */
  confirming: boolean
  /** Embaralhamento em andamento (overlay visível). */
  shuffling: boolean
  /** Texto exibido no frame atual do embaralhamento. */
  frameText: string
  ask: () => void
  cancel: () => void
  confirm: () => void
}

interface DrawFlowOptions {
  draw: () => void
  /** Textos do baralho atual, usados só como "cartas passando" no embaralhamento. */
  shuffleTexts: () => string[]
  muted: boolean
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Amostra até `n` textos distintos (Fisher-Yates parcial). */
function sample(texts: string[], n: number): string[] {
  const pool = [...texts]
  const out: string[] = []
  while (out.length < n && pool.length > 0) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0] as string)
  }
  return out
}

/**
 * Fluxo "sortear": confirmar -> embaralhar (~1,2s, com ticks) -> sortear de verdade -> som de revelação.
 * Com `prefers-reduced-motion` não há embaralhamento: sorteia direto (o som de revelação continua).
 * O áudio é destravado de forma síncrona no clique de confirmar.
 */
export function useDrawFlow({ draw, shuffleTexts, muted }: DrawFlowOptions): DrawFlow {
  const [confirming, setConfirming] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [frameText, setFrameText] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useRef({ draw, shuffleTexts, muted })

  useEffect(() => {
    latest.current = { draw, shuffleTexts, muted }
  })
  useEffect(() => () => clearTimeout(timer.current), [])

  const finish = useCallback(() => {
    setShuffling(false)
    latest.current.draw()
    if (!latest.current.muted) playReveal()
  }, [])

  const runFrames = useCallback(
    (frames: string[], index: number) => {
      if (index >= frames.length) return finish()
      setFrameText(frames[index] as string)
      if (!latest.current.muted) playTick(index)
      timer.current = setTimeout(() => runFrames(frames, index + 1), FIRST_DELAY_MS + index * DELAY_GROWTH_MS)
    },
    [finish],
  )

  const confirm = useCallback(() => {
    unlockAudio()
    setConfirming(false)
    const frames = prefersReducedMotion() ? [] : sample(latest.current.shuffleTexts(), SHUFFLE_FRAMES)
    if (frames.length === 0) return finish()
    setShuffling(true)
    runFrames(frames, 0)
  }, [finish, runFrames])

  return {
    confirming,
    shuffling,
    frameText,
    ask: () => {
      if (!shuffling) setConfirming(true)
    },
    cancel: () => setConfirming(false),
    confirm,
  }
}
