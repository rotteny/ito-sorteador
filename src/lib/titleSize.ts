/** Degraus de fonte do título da carta, do maior (texto curto) ao menor (muito longo). */
export const TITLE_SIZES = [34, 32, 30, 28, 26, 24] as const
export type TitleSize = (typeof TITLE_SIZES)[number]

const SHORT = 28
const LONG = 88

/** Reduz a fonte de 34px para 24px conforme o texto cresce (interpolação linear em degraus). */
export function titleSize(text: string): TitleSize {
  const len = text.trim().length
  const ratio = Math.min(1, Math.max(0, (len - SHORT) / (LONG - SHORT)))
  const step = Math.round(ratio * (TITLE_SIZES.length - 1))
  return TITLE_SIZES[step] ?? 24
}
