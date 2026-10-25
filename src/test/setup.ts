import { afterEach } from 'vitest'

/**
 * Setup compartilhado. Os testes de lógica rodam em `node`; os de componente pedem jsdom via
 * `// @vitest-environment jsdom`. O jsdom não implementa `showModal`/`close` do <dialog>:
 * polyfill mínimo, só aqui no ambiente de teste.
 */
if (typeof window !== 'undefined' && typeof HTMLDialogElement !== 'undefined') {
  const proto = HTMLDialogElement.prototype
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    }
  }
  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement) {
      if (!this.hasAttribute('open')) return
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  }

  // jsdom não tem matchMedia: simula "reduzir movimento" para o sorteio ser imediato nos testes.
  window.matchMedia ??= ((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia

  const { cleanup } = await import('@testing-library/react')
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })
}
