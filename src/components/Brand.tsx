import { Wave } from './Wave'
import './Brand.css'

/** Cabeçalho da Home: onda, "ito", slogan e subtítulo. */
export function Brand() {
  return (
    <header className="brand">
      <Wave />
      <h1 className="brand__logo">ito</h1>
      <div className="brand__tagline">
        <span className="brand__rule" aria-hidden="true" />
        <span className="mono">Ligue seus pensamentos!</span>
        <span className="brand__rule" aria-hidden="true" />
      </div>
      <p className="brand__subtitle mono">Sorteador de temas</p>
    </header>
  )
}
