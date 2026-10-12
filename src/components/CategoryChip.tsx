import type { CSSProperties } from 'react'
import type { Category } from '../data/types'
import './CategoryChip.css'

interface CategoryChipProps {
  category: Category
  selected: boolean
  onToggle: (id: string) => void
}

/** Chip de categoria; as cores vêm do dado via custom properties. */
export function CategoryChip({ category, selected, onToggle }: CategoryChipProps) {
  const vars = { '--chip-color': category.color, '--chip-fg': category.fg } as CSSProperties
  return (
    <button
      type="button"
      className="chip chip--category"
      style={vars}
      aria-pressed={selected}
      onClick={() => onToggle(category.id)}
    >
      <span className="chip__dot" aria-hidden="true" />
      {category.label}
    </button>
  )
}
