#!/usr/bin/env bash
# Publica o build estatico via rsync+ssh. Mesmo script no local e no CI.
# Idempotente: rodar de novo so sincroniza o que mudou.
#
# Uso:
#   bash scripts/deploy.sh                  # build + sync + smoke test
#   bash scripts/deploy.sh --with-original  # idem, enviando tambem public/data/original.json
#   SKIP_BUILD=1 bash scripts/deploy.sh     # usa o dist/ ja gerado (CI)
#
# Configuracao: variaveis de ambiente ou .env.deploy na raiz (ver .env.deploy.example).
set -euo pipefail

readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly ENV_FILE="$PROJECT_ROOT/.env.deploy"
readonly DIST_DIR="$PROJECT_ROOT/dist/"
readonly ORIGINAL_LOCAL="$PROJECT_ROOT/public/data/original.json"
readonly REQUIRED_VARS=(DEPLOY_HOST DEPLOY_PORT DEPLOY_USER DEPLOY_PATH PUBLIC_URL)

WITH_ORIGINAL=0

log() { printf '\n==> %s\n' "$*"; }
die() { echo "ERRO: $*" >&2; exit 1; }

parse_args() {
  local arg
  for arg in "$@"; do
    case "$arg" in
      --with-original) WITH_ORIGINAL=1 ;;
      -h|--help) sed -n '2,11p' "${BASH_SOURCE[0]}"; exit 0 ;;
      *) die "argumento desconhecido: $arg" ;;
    esac
  done
}

# Variaveis ja exportadas (ex.: CI) tem prioridade sobre o .env.deploy.
load_env_file() {
  [[ -f "$ENV_FILE" ]] || return 0
  local line key
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*(#|$) ]] && continue
    key="${line%%=*}"
    [[ "$key" =~ ^[A-Z_][A-Z0-9_]*$ ]] || die ".env.deploy: linha invalida (use CHAVE=valor, sem aspas): $line"
    [[ -n "${!key:-}" ]] && continue
    export "$line"
  done < "$ENV_FILE"
}

require_vars() {
  local var missing=()
  for var in "${REQUIRED_VARS[@]}"; do
    [[ -n "${!var:-}" ]] || missing+=("$var")
  done
  ((${#missing[@]} == 0)) || die "faltam variaveis: ${missing[*]} (defina no ambiente ou em .env.deploy; ver .env.deploy.example)"
}

require_commands() {
  local cmd
  for cmd in "$@"; do
    command -v "$cmd" >/dev/null || die "falta o comando: $cmd"
  done
}

# Chave e known_hosts sao opcionais: sem eles vale o padrao do ssh (~/.ssh).
build_ssh_command() {
  SSH_CMD="ssh -p $DEPLOY_PORT -o BatchMode=yes -o StrictHostKeyChecking=yes"
  [[ -n "${DEPLOY_KEY:-}" ]] && SSH_CMD+=" -i ${DEPLOY_KEY/#\~/$HOME} -o IdentitiesOnly=yes"
  [[ -n "${DEPLOY_KNOWN_HOSTS_FILE:-}" ]] && SSH_CMD+=" -o UserKnownHostsFile=${DEPLOY_KNOWN_HOSTS_FILE/#\~/$HOME}"
  readonly SSH_CMD
}

# Com a chave restrita (rrsync), DEPLOY_PATH e relativo a pasta liberada: "/" = raiz do site.
# O rrsync so aceita a raiz como "." exato ("/" e "./" sao recusados).
remote_target() {
  local base="${DEPLOY_PATH%/}" sub="${1:-}"
  base="${base:-.}"
  printf '%s@%s:%s' "$DEPLOY_USER" "$DEPLOY_HOST" "${base}${sub:+/$sub}"
}

build_project() {
  if [[ "${SKIP_BUILD:-0}" == "1" ]]; then
    log "Build pulado (SKIP_BUILD=1), usando dist/ existente"
  else
    log "Build (typecheck + vite build)"
    (cd "$PROJECT_ROOT" && npm run build)
  fi
  [[ -f "$DIST_DIR/index.html" ]] || die "dist/index.html nao existe"
}

validate_original_json() {
  [[ -f "$ORIGINAL_LOCAL" ]] || die "--with-original: $ORIGINAL_LOCAL nao existe"
  node -e 'const d=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); if(!Array.isArray(d)||!d.length) process.exit(1)' \
    "$ORIGINAL_LOCAL" || die "$ORIGINAL_LOCAL nao e um array JSON valido"
}

# Antes do dist: quando o JS novo entrar no ar, o baralho ja esta la.
sync_original() {
  ((WITH_ORIGINAL)) || return 0
  validate_original_json
  log "Enviando original.json -> $(remote_target data/)"
  # Destino e o diretorio, nao o arquivo: o rrsync fixa destinos existentes por inode
  # (/proc/self/fd/N) e o rsync nao consegue substituir um arquivo apontado assim.
  rsync -z --chmod=F644 -e "$SSH_CMD" "$ORIGINAL_LOCAL" "$(remote_target data/)"
}

sync_dist() {
  log "Sincronizando dist/ -> $(remote_target '')"
  # --delay-updates/--delete-after: o index.html novo so aparece junto com os assets novos,
  # e os assets antigos so somem no fim (abas abertas nao quebram no meio do deploy).
  # Os excludes tambem protegem os arquivos do --delete: o original.json vive so no servidor.
  rsync -rlptz --delete --delete-after --delay-updates \
    --chmod=D755,F644 \
    --exclude 'data/original.json' --exclude 'data/original.example.json' \
    -e "$SSH_CMD" \
    "$DIST_DIR" "$(remote_target '')"
}

check_home() {
  local status
  status="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$PUBLIC_URL/" || true)"
  [[ "$status" == "200" ]] || die "smoke test: home deu HTTP $status"
  echo "home: HTTP 200"
}

# O Apache tem FallbackResource /index.html: arquivo ausente vira 200 com HTML, entao o status nao basta.
check_original() {
  local body meta status content_type first_char
  body="$(mktemp)"
  meta="$(curl -s -o "$body" -w '%{http_code} %{content_type}' --max-time 20 "$PUBLIC_URL/data/original.json" || true)"
  status="${meta%% *}"
  content_type="${meta#* }"
  first_char="$(head -c 256 "$body" | tr -d ' \t\r\n')"
  first_char="${first_char:0:1}"
  rm -f "$body"
  [[ "$status" == "200" ]] || die "smoke test: /data/original.json deu HTTP $status"
  [[ "$content_type" == application/json* && "$first_char" == "[" ]] \
    || die "smoke test: /data/original.json nao e JSON (content-type: $content_type, inicio: '$first_char'). Rode com --with-original."
  echo "original.json: HTTP 200, $content_type"
}

smoke_test() {
  log "Smoke test $PUBLIC_URL"
  check_home
  check_original
}

main() {
  parse_args "$@"
  load_env_file
  require_vars
  require_commands rsync ssh curl
  [[ "${SKIP_BUILD:-0}" == "1" ]] || require_commands npm
  ((WITH_ORIGINAL)) && require_commands node
  build_ssh_command
  build_project
  sync_original
  sync_dist
  smoke_test
}

main "$@"
