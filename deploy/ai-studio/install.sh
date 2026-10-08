#!/usr/bin/env bash
# TAKATAK AI Studio installer. Run on a fresh Ubuntu/Debian VPS as root:
#   git clone https://github.com/takatakca/knowledgeAI.git /opt/knowledgeAI
#   bash /opt/knowledgeAI/deploy/ai-studio/install.sh
# Safe to run again: existing settings and data are kept.
set -euo pipefail
cd "$(dirname "$0")"
umask 077

say() { printf '\n\033[1;34m▸ %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
ask() { local v; read -r -p "$1 [$2]: " v; printf '%s' "${v:-$2}"; }
ask_secret() { local v; read -r -s -p "$1 (Enter to skip): " v; echo >&2; printf '%s' "$v"; }
hex() { openssl rand -hex "$1"; }
pw() { openssl rand -base64 24 | tr -d '/+=' | cut -c1-20; }

[ "$(id -u)" = 0 ] || die "Run as root (sudo bash install.sh)."

if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
  say "Installing Docker"
  curl -fsSL https://get.docker.com | sh
fi
command -v openssl >/dev/null || { apt-get update -y && apt-get install -y openssl; }

if [ ! -f .env ]; then
  if ss -ltn 2>/dev/null | grep -qE ':(80|443)\s'; then
    die "Ports 80/443 are already used on this server (Coolify or another web server?). Use a fresh VPS, or stop that service first."
  fi

  say "Settings (press Enter to accept the value in brackets)"
  KNOWLEDGE_DOMAIN=$(ask "Address for the team and clients" "knowledge.takatak.ca")
  LAB_DOMAIN=$(ask "Address for the admin multi-model lab" "lab.takatak.ca")
  ADMIN_EMAIL=$(ask "Admin login email" "admin@takatak.ca")

  say "AI API keys (typed keys are hidden; they stay in this server's .env only)"
  ANTHROPIC_KEY=$(ask_secret "Anthropic (Claude) API key")
  OPENAI_KEY=$(ask_secret "OpenAI (ChatGPT) API key")
  GOOGLE_KEY_IN=$(ask_secret "Google (Gemini) API key")
  XAI_KEY=$(ask_secret "xAI (Grok) API key")
  DEEPSEEK_KEY=$(ask_secret "DeepSeek API key")
  [ -n "$ANTHROPIC_KEY$OPENAI_KEY$GOOGLE_KEY_IN$XAI_KEY$DEEPSEEK_KEY" ] || die "Give at least one API key."

  ADMIN_PASSWORD=$(pw)
  LAB_ADMIN_PASSWORD=$(pw)

  bases=(); keys=()
  [ -n "$OPENAI_KEY" ] && { bases+=("https://api.openai.com/v1"); keys+=("$OPENAI_KEY"); }
  [ -n "$ANTHROPIC_KEY" ] && { bases+=("https://api.anthropic.com/v1"); keys+=("$ANTHROPIC_KEY"); }
  [ -n "$GOOGLE_KEY_IN" ] && { bases+=("https://generativelanguage.googleapis.com/v1beta/openai"); keys+=("$GOOGLE_KEY_IN"); }
  [ -n "$XAI_KEY" ] && { bases+=("https://api.x.ai/v1"); keys+=("$XAI_KEY"); }
  [ -n "$DEEPSEEK_KEY" ] && { bases+=("https://api.deepseek.com/v1"); keys+=("$DEEPSEEK_KEY"); }
  join() { local IFS=';'; printf '%s' "$*"; }

  {
    echo "# TAKATAK AI Studio. Secret: never commit, never paste in chat."
    echo "KNOWLEDGE_DOMAIN=$KNOWLEDGE_DOMAIN"
    echo "LAB_DOMAIN=$LAB_DOMAIN"
    echo "ADMIN_EMAIL=$ADMIN_EMAIL"
    echo "DOMAIN_CLIENT=https://$KNOWLEDGE_DOMAIN"
    echo "DOMAIN_SERVER=https://$KNOWLEDGE_DOMAIN"
    echo 'APP_TITLE="TAKATAK AI Studio"'
    echo 'CUSTOM_FOOTER="GROUPE TAKATAK · Digital Solutions. Real Results."'
    echo "HELP_AND_FAQ_URL=https://takatak.ca"
    echo "NO_INDEX=true"
    echo "TRUST_PROXY=1"
    echo "ALLOW_EMAIL_LOGIN=true"
    echo "ALLOW_REGISTRATION=false"
    echo "ALLOW_SOCIAL_LOGIN=false"
    echo "ALLOW_SOCIAL_REGISTRATION=false"
    echo "ALLOW_PASSWORD_RESET=false"
    echo "ALLOW_UNVERIFIED_EMAIL_LOGIN=true"
    echo "SCHEDULES_SINGLE_PROCESS=true"
    echo "SEARCH=true"
    echo "MEILI_MASTER_KEY=$(hex 32)"
    echo "CREDS_KEY=$(hex 32)"
    echo "CREDS_IV=$(hex 16)"
    echo "JWT_SECRET=$(hex 32)"
    echo "JWT_REFRESH_SECRET=$(hex 32)"
    echo "LAB_SECRET_KEY=$(hex 32)"
    echo "LAB_ADMIN_PASSWORD=$LAB_ADMIN_PASSWORD"
    echo "LAB_API_BASE_URLS=$(join "${bases[@]}")"
    echo "LAB_API_KEYS=$(join "${keys[@]}")"
    if [ -n "$ANTHROPIC_KEY" ]; then
      echo "ANTHROPIC_API_KEY=$ANTHROPIC_KEY"
      echo "ANTHROPIC_MODELS=claude-opus-5-5,claude-sonnet-5-5,claude-fable-5-1"
    fi
    if [ -n "$OPENAI_KEY" ]; then
      echo "OPENAI_API_KEY=$OPENAI_KEY"
      echo "OPENAI_MODELS=gpt-6-sol,gpt-6-astra,gpt-6-luna"
    fi
    if [ -n "$GOOGLE_KEY_IN" ]; then
      echo "GOOGLE_KEY=$GOOGLE_KEY_IN"
      echo "GOOGLE_MODELS=gemini-3.1-pro-preview,gemini-3.8-flash"
    fi
    [ -n "$XAI_KEY" ] && echo "XAI_API_KEY=$XAI_KEY"
    [ -n "$DEEPSEEK_KEY" ] && echo "DEEPSEEK_API_KEY=$DEEPSEEK_KEY"
    true
  } > .env
  chmod 600 .env
  printf 'Admin email: %s\nStudio password: %s\nLab password: %s\n' \
    "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "$LAB_ADMIN_PASSWORD" > .admin-first-login
  chmod 600 .admin-first-login
  FIRST_RUN=1
else
  say "Keeping the existing settings in .env"
  FIRST_RUN=0
fi

envget() { grep -E "^$1=" .env | head -1 | cut -d= -f2- || true; }
XAI_API_KEY=$(envget XAI_API_KEY); DEEPSEEK_API_KEY=$(envget DEEPSEEK_API_KEY)
KNOWLEDGE_DOMAIN=$(envget KNOWLEDGE_DOMAIN); LAB_DOMAIN=$(envget LAB_DOMAIN)

# librechat.yaml = base settings + the extra brands that have a key.
{
  cat librechat.base.yaml
  if [ -n "${XAI_API_KEY:-}${DEEPSEEK_API_KEY:-}" ]; then
    echo
    echo "endpoints:"
    echo "  custom:"
  fi
  if [ -n "${XAI_API_KEY:-}" ]; then
    cat <<'YAML'
    - name: 'xAI'
      apiKey: '${XAI_API_KEY}'
      baseURL: 'https://api.x.ai/v1'
      models:
        default: ['grok-4.7']
        fetch: false
      titleConvo: true
      titleModel: 'current_model'
      modelDisplayLabel: 'Grok'
YAML
  fi
  if [ -n "${DEEPSEEK_API_KEY:-}" ]; then
    cat <<'YAML'
    - name: 'DeepSeek'
      apiKey: '${DEEPSEEK_API_KEY}'
      baseURL: 'https://api.deepseek.com/v1'
      models:
        default: ['deepseek-v4-pro', 'deepseek-v4-flash']
        fetch: true
      titleConvo: true
      titleModel: 'current_model'
      modelDisplayLabel: 'DeepSeek'
YAML
  fi
} > librechat.yaml
chmod 644 librechat.yaml

mkdir -p data/images data/uploads data/logs data/mongo data/meili data/lab data/caddy
chown -R 1000:1000 data/images data/uploads data/logs 2>/dev/null || true

say "Starting (first start downloads about 3 GB, a few minutes)"
docker compose pull -q
docker compose up -d

say "Waiting for the studio to answer"
for _ in $(seq 1 90); do
  if docker compose exec -T studio sh -c 'wget -qO- http://127.0.0.1:3080/health >/dev/null 2>&1 || curl -fs http://127.0.0.1:3080/health >/dev/null'; then
    ready=1; break
  fi
  sleep 4
done
[ "${ready:-0}" = 1 ] || die "The studio did not start. See: docker compose logs studio"

if [ "$FIRST_RUN" = 1 ]; then
  say "Creating the admin account and giving it 20 USD of credits"
  ./admin.sh _create "$ADMIN_EMAIL" "TAKATAK Admin" "$ADMIN_PASSWORD" 20
fi

ip=$(curl -fs4 https://api.ipify.org || echo "this server's IP")
cat <<EOF

────────────────────────────────────────────────────────────
 TAKATAK AI Studio is running.

 1. DNS: add two A records pointing to $ip
      ${KNOWLEDGE_DOMAIN%%.*}   → $ip     (${KNOWLEDGE_DOMAIN})
      ${LAB_DOMAIN%%.*}         → $ip     (${LAB_DOMAIN})
    HTTPS certificates are issued automatically once DNS points here.

 2. Open https://${KNOWLEDGE_DOMAIN}  (team and clients, with credits)
    Open https://${LAB_DOMAIN}        (admins: one prompt to many models)
    First logins are in: $(pwd)/.admin-first-login
    Read it once (cat .admin-first-login), store it in your password manager, then delete it.

 3. Add people:   ./admin.sh user someone@example.com "Their Name" 10
    More credits: ./admin.sh credits someone@example.com 25
    All commands: ./admin.sh help
────────────────────────────────────────────────────────────
EOF
