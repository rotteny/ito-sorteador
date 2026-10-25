import { VolumeOffIcon, VolumeOnIcon } from './icons'
import './SoundToggle.css'

interface SoundToggleProps {
  muted: boolean
  onToggle: () => void
}

/** Botão de mudo/som do sorteio. */
export function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={muted}
      aria-label="Silenciar sons"
      title={muted ? 'Som desligado' : 'Som ligado'}
      onClick={onToggle}
    >
      {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
    </button>
  )
}
