import { describe, expect, it } from 'vitest'
import { fetchOriginalDeck, ORIGINAL_DECK_URL, parseOriginalDeck, type Fetcher } from './original'

const theme = (id: string) => ({ id, texto: `Tema ${id}`, min: 'pouco', max: 'muito' })

const respond =
  (body: string, status = 200): Fetcher =>
  async () =>
    new Response(body, { status })

describe('parseOriginalDeck', () => {
  it('aceita um array não vazio de {id, texto, min, max}', () => {
    expect(parseOriginalDeck([theme('a'), theme('b')])).toEqual([theme('a'), theme('b')])
  })

  it('descarta campos extras', () => {
    expect(parseOriginalDeck([{ ...theme('a'), lixo: 1 }])).toEqual([theme('a')])
  })

  it.each([
    ['null', null],
    ['objeto', { temas: [] }],
    ['array vazio', []],
    ['item sem campo', [{ id: 'a', texto: 'x', min: 'y' }]],
    ['campo vazio', [{ ...theme('a'), texto: '  ' }]],
    ['campo não-string', [{ ...theme('a'), min: 1 }]],
    ['ids repetidos', [theme('a'), theme('a')]],
  ])('rejeita %s', (_, raw) => {
    expect(parseOriginalDeck(raw)).toBeNull()
  })
})

describe('fetchOriginalDeck', () => {
  it('busca em /data/original.json e devolve o baralho', async () => {
    let asked = ''
    const fetcher: Fetcher = async (url) => {
      asked = url
      return new Response(JSON.stringify([theme('a')]))
    }
    expect(await fetchOriginalDeck(fetcher)).toEqual([theme('a')])
    expect(asked).toBe(ORIGINAL_DECK_URL)
  })

  it('404 → indisponível', async () => {
    expect(await fetchOriginalDeck(respond('not found', 404))).toBeNull()
  })

  it('HTML de fallback do servidor (200) → indisponível', async () => {
    expect(await fetchOriginalDeck(respond('<!doctype html><html></html>'))).toBeNull()
  })

  it('JSON fora do formato → indisponível', async () => {
    expect(await fetchOriginalDeck(respond('[]'))).toBeNull()
  })

  it('erro de rede → indisponível, sem lançar', async () => {
    expect(await fetchOriginalDeck(() => Promise.reject(new TypeError('offline')))).toBeNull()
  })

  it('timeout → indisponível', async () => {
    const hang: Fetcher = (_, init) =>
      new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('abort'))))
    expect(await fetchOriginalDeck(hang, 10)).toBeNull()
  })
})
