import './Wave.css'

/** Onda colorida do logo (6 segmentos + ponto amarelo), igual ao mockup. */
export function Wave() {
  return (
    <svg
      className="wave"
      viewBox="0 0 390 96"
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M-4 62 L36 62 C54 62 54 30 72 30" stroke="var(--wave-1)" />
      <path d="M72 30 C92 30 92 80 116 80 C138 80 136 46 156 46" stroke="var(--wave-2)" />
      <path d="M156 46 C176 46 180 76 204 76" stroke="var(--wave-3)" />
      <path d="M204 76 C228 76 226 24 248 24" stroke="var(--wave-4)" />
      <path d="M248 24 C270 24 272 68 302 68" stroke="var(--wave-5)" />
      <path d="M302 68 L394 68" stroke="var(--wave-6)" />
      <circle cx="248" cy="24" r="7" fill="var(--wave-4)" stroke="none" />
    </svg>
  )
}
