import type { Mode } from './draw'

/** "1 tema" / "140 temas": número + palavra no singular ou plural. */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function themeCount(count: number): string {
  return pluralize(count, 'tema', 'temas')
}

export interface ResetScope {
  mode: Mode
  /** true quando há categorias filtradas (seleção diferente de "Todos"). */
  filtered: boolean
}

/** Corpo do dialog "Recomeçar o baralho?" com o número real de cartas sorteadas. */
export function resetConfirmMessage(used: number, { mode, filtered }: ResetScope): string {
  const one = used === 1
  const cards = one ? 'A carta já sorteada' : `As ${used} cartas já sorteadas`
  const where = mode === 'extras' ? (filtered ? ' nas categorias filtradas' : ' nos temas extras') : ''
  const verb = one ? 'volta' : 'voltam'
  const base = `${cards}${where} ${verb} para o baralho e a contagem de rodadas é zerada.`
  return mode === 'extras' && filtered ? `${base} As outras categorias continuam como estão.` : base
}
