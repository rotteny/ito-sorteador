import type { Category } from '../data/types'
import { CategoryChip } from './CategoryChip'
import './CategoryFilter.css'

interface CategoryFilterProps {
  categories: readonly Category[]
  selected: readonly string[]
  poolSize: number
  onToggle: (id: string) => void
  onSelectAll: () => void
}

/** Filtro dos temas extras: "Todos" + um chip por categoria. Seleção vazia = Todos. */
export function CategoryFilter({ categories, selected, poolSize, onToggle, onSelectAll }: CategoryFilterProps) {
  return (
    <section className="category-filter" aria-labelledby="category-filter-title">
      <div className="category-filter__head mono">
        <h2 id="category-filter-title" className="category-filter__title">
          Filtrar por tema
        </h2>
        <span aria-live="polite">{poolSize} perguntas</span>
      </div>
      <div className="category-filter__chips">
        <button type="button" className="chip" aria-pressed={selected.length === 0} onClick={onSelectAll}>
          Todos
        </button>
        {categories.map((c) => (
          <CategoryChip key={c.id} category={c} selected={selected.includes(c.id)} onToggle={onToggle} />
        ))}
      </div>
    </section>
  )
}
