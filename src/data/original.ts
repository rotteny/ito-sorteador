import type { OriginalTheme } from './types'

/** Servido de `public/data/` — não faz parte do repositório nem do bundle (direitos da editora). */
export const ORIGINAL_DECK_URL = '/data/original.json'

const FETCH_TIMEOUT_MS = 5000

const filled = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0

function isOriginalTheme(v: unknown): v is OriginalTheme {
  if (typeof v !== 'object' || v === null) return false
  const t = v as Record<string, unknown>
  return filled(t.id) && filled(t.texto) && filled(t.min) && filled(t.max)
}

/** Aceita só um array não vazio de `{id, texto, min, max}` com ids únicos. Qualquer outra coisa = indisponível. */
export function parseOriginalDeck(raw: unknown): OriginalTheme[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every(isOriginalTheme)) return null
  if (new Set(raw.map((t) => t.id)).size !== raw.length) return null
  return raw.map(({ id, texto, min, max }) => ({ id, texto, min, max }))
}

export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>

/**
 * Busca o baralho original. Nunca lança: 404, rede fora, timeout, HTML de fallback
 * do servidor ou JSON fora do formato resolvem para `null` (modo original indisponível).
 */
export async function fetchOriginalDeck(fetcher: Fetcher = fetch, timeoutMs = FETCH_TIMEOUT_MS): Promise<OriginalTheme[] | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetcher(ORIGINAL_DECK_URL, { signal: controller.signal })
    if (!res.ok) return null
    return parseOriginalDeck(await res.json())
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
