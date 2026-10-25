/**
 * Sons do sorteio gerados com Web Audio API: sem arquivo, funcionam offline e não pesam no build.
 * O AudioContext só é criado/retomado dentro de um gesto do usuário (`unlockAudio`), exigência
 * do autoplay no mobile. Qualquer falha de áudio é silenciosa: o sorteio nunca depende do som.
 */

const MUTED_KEY = 'ito-sorteador:muted'

type AudioContextCtor = typeof AudioContext

let ctx: AudioContext | null = null

function contextCtor(): AudioContextCtor | undefined {
  if (typeof window === 'undefined') return undefined
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
}

/** Cria (uma vez) e retoma o AudioContext. Chame de dentro de um clique/toque. */
export function unlockAudio(): void {
  try {
    const Ctor = contextCtor()
    if (!Ctor) return
    ctx ??= new Ctor()
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined)
  } catch {
    ctx = null
  }
}

interface BlipOptions {
  freq: number
  duration: number
  volume: number
  type: OscillatorType
  /** Atraso em segundos a partir de agora. */
  delay?: number
}

function blip({ freq, duration, volume, type, delay = 0 }: BlipOptions): void {
  if (!ctx || ctx.state !== 'running') return
  try {
    const start = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + duration + 0.02)
  } catch {
    /* sem som, sem problema */
  }
}

/** Tick curto do embaralhamento; o tom sobe um pouco a cada passo (`step` 0, 1, 2...). */
export function playTick(step: number): void {
  blip({ freq: 520 + (step % 8) * 28, duration: 0.05, volume: 0.12, type: 'triangle' })
}

/** Revelação: três notas ascendentes (arpejo maior). */
export function playReveal(): void {
  const notes = [523.25, 659.25, 783.99]
  notes.forEach((freq, i) => blip({ freq, duration: 0.22, volume: 0.16, type: 'sine', delay: i * 0.09 }))
}

export function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === '1'
  } catch {
    return false
  }
}

export function saveMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTED_KEY, muted ? '1' : '0')
  } catch {
    /* modo privado / cota cheia: a preferência vale só nesta sessão */
  }
}
