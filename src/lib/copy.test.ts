import { describe, expect, it } from 'vitest'
import { resetConfirmMessage, themeCount } from './copy'

describe('themeCount', () => {
  it('usa "tema" no singular e "temas" no plural', () => {
    expect(themeCount(1)).toBe('1 tema')
    expect(themeCount(140)).toBe('140 temas')
    expect(themeCount(0)).toBe('0 temas')
  })
})

describe('resetConfirmMessage', () => {
  it('baralho original: usa o número real de cartas', () => {
    expect(resetConfirmMessage(7, { mode: 'original', filtered: false })).toBe(
      'As 7 cartas já sorteadas voltam para o baralho e a contagem de rodadas é zerada.',
    )
  })

  it('concorda no singular', () => {
    expect(resetConfirmMessage(1, { mode: 'original', filtered: false })).toBe(
      'A carta já sorteada volta para o baralho e a contagem de rodadas é zerada.',
    )
  })

  it('extras sem filtro: fala dos temas extras', () => {
    expect(resetConfirmMessage(3, { mode: 'extras', filtered: false })).toContain('As 3 cartas já sorteadas nos temas extras')
  })

  it('extras filtrados: deixa claro que vale só para as categorias filtradas', () => {
    const msg = resetConfirmMessage(2, { mode: 'extras', filtered: true })
    expect(msg).toContain('As 2 cartas já sorteadas nas categorias filtradas voltam')
    expect(msg).toContain('As outras categorias continuam como estão.')
  })
})
