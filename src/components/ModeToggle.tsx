import type { Mode } from '../lib/draw'
import './ModeToggle.css'

interface ModeToggleProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

const OPTIONS: ReadonlyArray<{ value: Mode; label: string }> = [
  { value: 'original', label: 'Baralho original' },
  { value: 'extras', label: 'Temas extras' },
]

/** Seletor segmentado entre os dois baralhos. */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="group" aria-label="Baralho">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="mode-toggle__option"
          aria-pressed={mode === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
