# ito · Sorteador de Temas

PWA não oficial para sortear temas do party game **ito**: cada jogador recebe um número secreto de 1 a 100 e todos usam o tema sorteado para descrever o próprio número sem dizê-lo, tentando colocar as cartas em ordem.

Funciona offline, instala na tela inicial do celular e não precisa de servidor: é um site estático.

> **Projeto de fã, sem vínculo com a editora.** "ito" e os temas oficiais do jogo pertencem aos seus respectivos detentores. Este repositório **não contém** os temas originais; compre o jogo para tê-los. 🙂

## Recursos

- **Temas extras** por categoria (Cinema, Comida, Turismo, Música, Esportes, Trabalho, Infância), filtráveis, para eventos temáticos.
- **Baralho original (opcional):** se você tiver o jogo, pode fornecer seus próprios temas em `public/data/original.json` (ver abaixo). Sem esse arquivo, o app mostra só os temas extras.
- Sorteio sem repetição até esgotar o baralho, progresso salvo no aparelho, vibração ao sortear e tela sempre acesa durante a carta.

## Rodando

```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes (Vitest)
npm run build      # build de produção em dist/
npm run preview -- --host
```

Requer Node.js 20+.

## Temas

### Extras (`src/data/extras.json`)

```json
{
  "categories": [{ "id": "cinema", "label": "Cinema", "color": "#6B3FA0", "fg": "#FFFFFF" }],
  "themes": [{ "id": "cin-01", "categoria": "cinema", "texto": "Filmes para ver no dia da estreia", "min": "nem de graça", "max": "fila na madrugada" }]
}
```

- `min` é o rótulo da ponta **1** e `max` o da ponta **100**.
- `fg` é a cor do texto sobre `color` no chip selecionado (garanta contraste).
- Para criar uma categoria nova (ex.: o tema de uma festa), adicione-a em `categories` e os temas em `themes`. PRs com temas novos são bem-vindos!

### Baralho original (`public/data/original.json`, fora do git)

Array de `{ "id", "texto", "min", "max" }`. Veja o formato em [`public/data/original.example.json`](public/data/original.example.json). O arquivo é carregado em tempo de execução e está no `.gitignore`.

## Deploy

Qualquer hospedagem estática serve (GitHub Pages, Cloudflare Pages, Netlify, Apache/nginx). Sirva `sw.js`, `index.html` e `manifest.webmanifest` com `Cache-Control: no-cache` para o PWA atualizar, e `/assets/` com cache longo.

## Licença

- Código: [MIT](LICENSE).
- Temas extras (`src/data/extras.json`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br).
- Fontes Quicksand e DM Mono: SIL Open Font License, via `@fontsource`.
