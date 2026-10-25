// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Sorteador } from '../App'
import { decksFixture } from '../lib/__fixtures__/decks'
import { savedState, seedStorage } from '../test/seed'

const resumeButton = () => screen.queryByRole('button', { name: /Ver tema atual/ })

async function drawAndConfirm() {
  await userEvent.click(screen.getByRole('button', { name: /^Sortear (tema|outro)$/ }))
  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Sortear' }))
}

describe('Home: "Ver tema atual"', () => {
  it('não aparece sem carta atual', () => {
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    expect(resumeButton()).toBeNull()
  })

  it('volta para a mesma carta e rodada sem sortear, vibrar ou mudar a contagem', async () => {
    const vibrate = vi.fn()
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true })
    seedStorage({ usedOrig: ['o-1', 'o-7'], round: 2, current: { original: 'o-7' } })
    render(<Sorteador decks={decksFixture} />)

    await userEvent.click(resumeButton()!)

    expect(screen.getByRole('heading', { level: 2, name: 'Tema 7' })).toBeTruthy()
    expect(screen.getByText('Rodada 2')).toBeTruthy()
    expect(screen.queryByText(/Baralho completo/)).toBeNull()
    expect(vibrate).not.toHaveBeenCalled()
    const saved = savedState()
    expect(saved.screen).toBe('card')
    expect(saved.deck.usedOrig).toEqual(['o-1', 'o-7'])
    expect(saved.deck.round).toBe(2)

    // De volta à Home, a contagem continua a mesma.
    await userEvent.click(screen.getByRole('button', { name: 'Voltar ao início' }))
    expect(screen.getByText('Sorteadas 2/100')).toBeTruthy()
  })

  it('aparece depois de um sorteio e continua valendo após recarregar', async () => {
    seedStorage({})
    const first = render(<Sorteador decks={decksFixture} />)
    await drawAndConfirm()
    await userEvent.click(screen.getByRole('button', { name: 'Trocar baralho' }))
    expect(resumeButton()).toBeTruthy()

    first.unmount()
    render(<Sorteador decks={decksFixture} />)
    expect(resumeButton()).toBeTruthy()
  })

  it('some depois do "Recomeçar" confirmado', async () => {
    seedStorage({ usedOrig: ['o-3'], round: 1, current: { original: 'o-3' } })
    render(<Sorteador decks={decksFixture} />)
    expect(resumeButton()).toBeTruthy()

    await userEvent.click(screen.getByRole('button', { name: 'Recomeçar' }))
    const dialog = screen.getByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Recomeçar' }))

    expect(resumeButton()).toBeNull()
    expect(savedState().current).toEqual({ original: null, extras: null })
  })

  it('respeita o modo: cada baralho mostra a sua própria carta atual', async () => {
    seedStorage({ mode: 'extras', usedExtra: ['comida-2'], round: 1, current: { extras: 'comida-2' } })
    render(<Sorteador decks={decksFixture} />)
    expect(resumeButton()).toBeTruthy()

    await userEvent.click(screen.getByRole('button', { name: /Baralho original/ }))
    expect(resumeButton()).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: /Temas extras/ }))
    await userEvent.click(resumeButton()!)
    expect(screen.getByRole('heading', { level: 2, name: 'comida 2' })).toBeTruthy()
  })

  it('esconde a carta de uma categoria que saiu do filtro', async () => {
    seedStorage({ mode: 'extras', usedExtra: ['comida-2'], round: 1, current: { extras: 'comida-2' } })
    render(<Sorteador decks={decksFixture} />)

    await userEvent.click(screen.getByRole('button', { name: 'cinema' }))
    expect(resumeButton()).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'comida' }))
    expect(resumeButton()).toBeTruthy()
  })
})

describe('crédito do autor', () => {
  it('aparece na Home e não na tela da carta', async () => {
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    expect(screen.getByRole('link', { name: /feito por @rotteny/ })).toBeTruthy()
    await drawAndConfirm()
    expect(screen.queryByRole('link', { name: /feito por @rotteny/ })).toBeNull()
  })
})
