import { GithubIcon } from './icons'
import './AuthorCredit.css'

const PROFILE_URL = 'https://github.com/rotteny'

/** Nota de rodapé discreta da Home com o perfil do autor no GitHub. */
export function AuthorCredit() {
  return (
    <p className="author-credit mono">
      <a className="author-credit__link" href={PROFILE_URL} target="_blank" rel="noopener">
        <GithubIcon />
        feito por @rotteny
        <span className="visually-hidden"> (abre em nova aba)</span>
      </a>
    </p>
  )
}
