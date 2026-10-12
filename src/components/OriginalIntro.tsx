import './OriginalIntro.css'

interface OriginalIntroProps {
  /** Quantidade de cartas do baralho carregado (100 no jogo original). */
  total: number
}

/** Explicação do modo "Baralho original". */
export function OriginalIntro({ total }: OriginalIntroProps) {
  return (
    <section className="original-intro">
      <h2 className="original-intro__title">{total} cartas de tema</h2>
      <p className="original-intro__text">
        O app sorteia um dos {total} temas do baralho. Leia em voz alta e cada um descreve seu número sem dizê-lo.
        Nenhum tema se repete até saírem todos.
      </p>
    </section>
  )
}
