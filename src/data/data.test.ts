import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseOriginalDeck } from './original'
import type { ExtrasData, OriginalTheme } from './types'

const path = (f: string) => fileURLToPath(new URL(f, import.meta.url))
const read = <T>(f: string): T => JSON.parse(readFileSync(path(f), 'utf8')) as T
const filled = (v: unknown) => typeof v === 'string' && v.trim().length > 0

const ORIGINAL = '../../public/data/original.json'
const ORIGINAL_EXAMPLE = '../../public/data/original.example.json'
const hasOriginal = existsSync(path(ORIGINAL))

// O original.json não é versionado (direitos da editora). Sem ele, os testes de integridade são pulados.
describe('public/data/original.json', () => {
  if (!hasOriginal) {
    it.skip('PULADO: public/data/original.json não existe (arquivo fora do repositório; formato em original.example.json)', () => {})
    return
  }
  const data = read<OriginalTheme[]>(ORIGINAL)

  it('tem 100 temas', () => expect(data).toHaveLength(100))
  it('ids únicos', () => expect(new Set(data.map((t) => t.id)).size).toBe(data.length))
  it('nenhum campo vazio', () => {
    const bad = data.filter((t) => ![t.id, t.texto, t.min, t.max].every(filled))
    expect(bad).toEqual([])
  })
  it('passa na mesma validação que o app usa em tempo de execução', () => {
    expect(parseOriginalDeck(data)).toHaveLength(data.length)
  })
})

describe('public/data/original.example.json', () => {
  const data = read<unknown>(ORIGINAL_EXAMPLE)

  it('documenta o formato aceito pelo app', () => expect(parseOriginalDeck(data)).toHaveLength(3))
  it.runIf(hasOriginal)('não reaproveita nenhum texto do baralho original', () => {
    const real = new Set(read<OriginalTheme[]>(ORIGINAL).flatMap((t) => [t.texto, t.min, t.max]))
    const example = parseOriginalDeck(data) ?? []
    expect(example.flatMap((t) => [t.texto, t.min, t.max]).filter((s) => real.has(s))).toEqual([])
  })
})

describe.skipIf(!existsSync(path('./extras.json')))('extras.json', () => {
  const data = read<ExtrasData>('./extras.json')
  const catIds = new Set(data.categories.map((c) => c.id))

  it('categorias com id, label e cores', () => {
    expect(data.categories.length).toBeGreaterThan(0)
    expect(catIds.size).toBe(data.categories.length)
    for (const c of data.categories) expect([c.id, c.label, c.color, c.fg].every(filled)).toBe(true)
  })
  it('toda categoria de tema existe em categories', () => {
    expect(data.themes.filter((t) => !catIds.has(t.categoria))).toEqual([])
  })
  it('ids únicos e nenhum campo vazio', () => {
    expect(new Set(data.themes.map((t) => t.id)).size).toBe(data.themes.length)
    expect(data.themes.filter((t) => ![t.id, t.categoria, t.texto, t.min, t.max].every(filled))).toEqual([])
  })
  it('toda categoria tem ao menos um tema', () => {
    const used = new Set(data.themes.map((t) => t.categoria))
    expect([...catIds].filter((c) => !used.has(c))).toEqual([])
  })
})
