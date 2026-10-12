/** Grava um estado do sorteio no localStorage antes de montar a interface (só ids sintéticos). */
export const STORAGE_KEY = 'ito-sorteador:v1'

export interface SeedState {
  mode?: 'original' | 'extras'
  sel?: string[]
  usedOrig?: string[]
  usedExtra?: string[]
  round?: number
  current?: { original?: string | null; extras?: string | null }
}

export function seedStorage({ current, ...deck }: SeedState): void {
  const full = { mode: 'original', sel: [], usedOrig: [], usedExtra: [], round: 0, ...deck }
  const cur = { original: null, extras: null, ...current }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ deck: full, screen: 'home', current: cur }))
}

export function savedState(): { deck: Record<string, unknown>; current: Record<string, unknown>; screen: string } {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
}
