import extrasJson from './extras.json'
import type { Decks, ExtrasData, OriginalTheme } from './types'

const extras: ExtrasData = extrasJson

/** Monta os baralhos. `original = null` quando o arquivo não está disponível no servidor. */
export function buildDecks(original: readonly OriginalTheme[] | null): Decks {
  return { original, extras: extras.themes, categories: extras.categories }
}
