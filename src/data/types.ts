/** Tema do baralho original (100 cartas). */
export interface OriginalTheme {
  id: string
  texto: string
  min: string
  max: string
}

/** Categoria dos temas extras (Cinema, Comida...). */
export interface Category {
  id: string
  label: string
  /** Cor de destaque da categoria. */
  color: string
  /** Cor do texto sobre `color`. */
  fg: string
}

/** Tema extra, ligado a uma categoria. */
export interface ExtraTheme extends OriginalTheme {
  categoria: string
}

export interface ExtrasData {
  categories: Category[]
  themes: ExtraTheme[]
}

/** Conjunto de baralhos que alimenta o sorteio. */
export interface Decks {
  /** `null` = baralho original indisponível (arquivo ausente/inválido): o modo some da UI. */
  original: readonly OriginalTheme[] | null
  extras: readonly ExtraTheme[]
  categories: readonly Category[]
}
