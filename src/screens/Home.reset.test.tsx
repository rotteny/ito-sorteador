// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Sorteador } from '../App'
import { decksFixture } from '../lib/__fixtures__/decks'
import { savedState, seedStorage } from '../test/seed'

const resetButton = () => screen.getByRole('button', { name: 'Recomeçar' })
const dialog = () =>
  screen.getAllByRole('dialog', { hidden: true }).find((d) => d.textContent?.includes('Recomeçar o baralho?')) as HTMLDialogElement
const savedRound = () => savedState().deck.round as number

describe('Home: confirmação do "Recomeçar"', () => {
  it('fica desabilitado quando nada foi sorteado', () => {
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    expect((resetButton() as HTMLButtonElement).disabled).toBe(true)
  })

  it('abre o dialog com o número real e foco em "Cancelar"', async () => {
    seedStorage({ usedOrig: ['o-1', 'o-2', 'o-3'], round: 3 })
    render(<Sorteador decks={decksFixture} />)
    await userEvent.click(resetButton())

    const d = dialog()
    expect(d.open).toBe(true)
    expect(within(d).getByRole('heading', { name: 'Recomeçar o baralho?' })).toBeTruthy()
    expect(d.textContent).toContain(
      'As 3 cartas já sorteadas voltam para o baralho e a contagem de rodadas é zerada.',
    )
    expect(document.activeElement).toBe(within(d).getByRole('button', { name: 'Cancelar' }))
  })

  it('cancelar fecha sem zerar e devolve o foco ao "Recomeçar"', async () => {
    seedStorage({ usedOrig: ['o-1', 'o-2'], round: 2 })
    render(<Sorteador decks={decksFixture} />)
    const trigger = resetButton()
    await userEvent.click(trigger)
    await userEvent.click(within(dialog()).getByRole('button', { name: 'Cancelar' }))

    expect(dialog().open).toBe(false)
    expect(screen.getByText('Sorteadas 2/100')).toBeTruthy()
    expect(savedRound()).toBe(2)
    expect(document.activeElement).toBe(trigger)
  })

  it('Esc (evento cancel) e clique no fundo também cancelam', async () => {
    seedStorage({ usedOrig: ['o-1'], round: 1 })
    render(<Sorteador decks={decksFixture} />)

    await userEvent.click(resetButton())
    fireEvent(dialog(), new Event('cancel', { cancelable: true }))
    expect(dialog().open).toBe(false)

    await userEvent.click(resetButton())
    fireEvent.click(dialog())
    expect(dialog().open).toBe(false)
    expect(screen.getByText('Sorteadas 1/100')).toBeTruthy()
  })

  it('confirmar zera o pool e a rodada', async () => {
    seedStorage({ usedOrig: ['o-1', 'o-2', 'o-3'], round: 3 })
    render(<Sorteador decks={decksFixture} />)
    await userEvent.click(resetButton())
    await userEvent.click(within(dialog()).getByRole('button', { name: 'Recomeçar' }))

    expect(dialog().open).toBe(false)
    expect(screen.getByText('Sorteadas 0/100')).toBeTruthy()
    expect(savedRound()).toBe(0)
    expect((resetButton() as HTMLButtonElement).disabled).toBe(true)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Sortear tema' }))
  })

  it('nos extras filtrados, avisa que vale para as categorias filtradas e preserva as outras', async () => {
    seedStorage({ mode: 'extras', sel: ['cinema'], usedExtra: ['cinema-1', 'cinema-2', 'comida-1'], round: 3 })
    render(<Sorteador decks={decksFixture} />)
    expect(screen.getByText('Sorteadas 2/4')).toBeTruthy()

    await userEvent.click(resetButton())
    expect(dialog().textContent).toContain('As 2 cartas já sorteadas nas categorias filtradas voltam')
    await userEvent.click(within(dialog()).getByRole('button', { name: 'Recomeçar' }))

    expect(screen.getByText('Sorteadas 0/4')).toBeTruthy()
    expect(savedState().deck.usedExtra).toEqual(['comida-1'])
  })
})
