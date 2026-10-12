// Gera os ícones PWA a partir de um SVG: fundo branco, "ito" em #3D3D40 e a onda colorida.
// O texto vira <path> via opentype.js (Quicksand 700 do @fontsource), para não depender de fonte instalada.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const out = `${root}public/icons/`
const fontFile = `${root}node_modules/@fontsource/quicksand/files/quicksand-latin-700-normal.woff`

const WAVE = [
  ['M-4 62 L36 62 C54 62 54 30 72 30', '#6B3FA0'],
  ['M72 30 C92 30 92 80 116 80 C138 80 136 46 156 46', '#2E86DE'],
  ['M156 46 C176 46 180 76 204 76', '#3BA55C'],
  ['M204 76 C228 76 226 24 248 24', '#F2C531'],
  ['M248 24 C270 24 272 68 302 68', '#F28C28'],
  ['M302 68 L394 68', '#E8452C'],
]

const buf = await readFile(fontFile)
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))

/** Desenha "ito" centralizado em (cx, baseline) com letter-spacing proporcional ao mockup (6px em 84px). */
function itoPath(size, cx, baseline) {
  const spacing = size * (6 / 84)
  const glyphs = font.stringToGlyphs('ito')
  const scale = size / font.unitsPerEm
  const widths = glyphs.map((g) => g.advanceWidth * scale)
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (glyphs.length - 1)
  let x = cx - total / 2
  return glyphs
    .map((g, i) => {
      const d = g.getPath(x, baseline, size).toPathData(2)
      x += (widths[i] ?? 0) + spacing
      return d
    })
    .join(' ')
}

/**
 * @param {number} pad fração da arte ocupada pela "zona segura" (maskable usa 80%).
 */
function iconSvg(pad) {
  const S = 512
  const inner = S * pad
  const off = (S - inner) / 2
  // Arte composta num quadro 512 e reduzida para a zona segura.
  const waveScale = 440 / 390
  const art = `
    <g transform="translate(36 70) scale(${waveScale})" fill="none" stroke-width="10" stroke-linecap="round">
      ${WAVE.map(([d, c]) => `<path d="${d}" stroke="${c}"/>`).join('')}
      <circle cx="248" cy="24" r="12" fill="#F2C531" stroke="none"/>
    </g>
    <path d="${itoPath(250, 256, 400)}" fill="#3D3D40"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="#FFFFFF"/>
  <g transform="translate(${off} ${off}) scale(${pad})">${art}</g>
</svg>`
}

await mkdir(out, { recursive: true })
const regular = iconSvg(0.92)
const maskable = iconSvg(0.72)
await writeFile(`${out}icon.svg`, regular)

const png = (svg, size, file) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(`${out}${file}`)
await Promise.all([
  png(regular, 192, 'icon-192.png'),
  png(regular, 512, 'icon-512.png'),
  png(maskable, 512, 'icon-maskable-512.png'),
  png(regular, 180, 'apple-touch-icon.png'),
])
console.log('Ícones gerados em public/icons/')
