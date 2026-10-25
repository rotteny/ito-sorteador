// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Sorteador } from '../App'
import { decksFixture } from '../lib/__fixtures__/decks'
import { savedState, seedStorage } from '../test/seed'

const drawButton = () => screen.getByRole('button', { name: 'Sortear tema' })
const dialog = () =>
  screen.getAllByRole('dialog', { hidden: true }).find((d) => d.textContent?.includes('Sortear um tema?')) as HTMLDialogElement

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Sortear: confirmação', () => {
  it('abre o dialog sem sortear e cancelar mantém tudo como estava', async () => {
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    await userEvent.click(drawButton())
    expect(dialog().open).toBe(true)
    expect(savedState().deck.round).toBe(0)

    await userEvent.click(within(dialog()).getByRole('button', { name: 'Cancelar' }))
    expect(dialog().open).toBe(false)
    expect(savedState().deck.round).toBe(0)
    expect(document.activeElement).toBe(drawButton())
  })

  it('confirmar sorteia', async () => {
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    await userEvent.click(drawButton())
    await userEvent.click(within(dialog()).getByRole('button', { name: 'Sortear' }))
    expect(savedState().deck.round).toBe(1)
  })
})

describe('Sortear: embaralhamento e som', () => {
  it('sem reduced-motion, mostra o overlay e só sorteia no fim', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }))
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    vi.useFakeTimers({ shouldAdvanceTime: true })
    await userEvent.click(drawButton())
    await userEvent.click(within(dialog()).getByRole('button', { name: 'Sortear' }))
    expect(screen.getByRole('status').textContent).toContain('Sorteando')
    expect(savedState().deck.round).toBe(0)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000)
    })
    expect(screen.queryByRole('status')).toBeNull()
    expect(savedState().deck.round).toBe(1)
  })

  it('o mudo é salvo em localStorage', async () => {
    seedStorage({})
    render(<Sorteador decks={decksFixture} />)
    await userEvent.click(screen.getByRole('button', { name: 'Silenciar sons' }))
    expect(localStorage.getItem('ito-sorteador:muted')).toBe('1')
    expect(screen.getByRole('button', { name: 'Silenciar sons' }).getAttribute('aria-pressed')).toBe('true')
  })
})
