import './CardWave.css'

/** Onda de uma cor no topo da carta; a cor vem do tema via `currentColor`. */
export function CardWave() {
  return (
    <svg className="card-wave" viewBox="0 0 300 34" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M-4 20 C30 20 34 6 60 6 C86 6 90 28 120 28 C150 28 152 10 180 10 C208 10 212 24 240 24 C262 24 270 16 304 16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
