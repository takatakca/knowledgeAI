#!/usr/bin/env bash
# TAKATAK AI Studio admin commands. Run from this folder on the server.
# Credits are in US dollars of AI usage (1 USD = 1,000,000 credits).
set -euo pipefail
cd "$(dirname "$0")"

lc() { docker compose exec -T studio npm run --silent "$@"; }
usd() { awk -v d="$1" 'BEGIN { if (d !~ /^[0-9]+(\.[0-9]+)?$/) exit 1; printf "%d", d * 1000000 }' \
  || { echo "Amount must be a number of US dollars, e.g. 10 or 2.5" >&2; exit 1; }; }
pw() { openssl rand -base64 24 | tr -d '/+=' | cut -c1-16; }
domain() { grep -E '^KNOWLEDGE_DOMAIN=' .env | cut -d= -f2; }

create() { # email name password dollars
  local username
  username=$(printf '%s' "${1%%@*}" | tr -cd 'a-zA-Z0-9._-' | cut -c1-30)
  lc create-user -- "$1" "$2" "$username" "$3" --email-verified=true
  if [ "${4:-0}" != 0 ]; then lc add-balance -- "$1" "$(usd "$4")"; fi
}

case "${1:-help}" in
  user)     # user <email> "<name>" [dollars]
    [ $# -ge 3 ] || { echo 'Usage: ./admin.sh user <email> "<name>" [dollars]'; exit 1; }
    pass=$(pw)
    create "$2" "$3" "$pass" "${4:-0}"
    printf '\nSend this to %s (by a private channel):\n  https://%s\n  Email: %s\n  Password: %s\n' \
      "$3" "$(domain)" "$2" "$pass" ;;
  _create)  create "$2" "$3" "$4" "${5:-0}" ;;
  credits)  # credits <email> <dollars>
    [ $# -eq 3 ] || { echo 'Usage: ./admin.sh credits <email> <dollars>'; exit 1; }
    lc add-balance -- "$2" "$(usd "$3")" ;;
  set-credits) [ $# -eq 3 ] || exit 1; lc set-balance -- "$2" "$(usd "$3")" ;;
  balances) lc list-balances ;;
  users)    lc list-users ;;
  stats)    lc user-stats ;;
  ban)      # ban <email> <days>
    [ $# -eq 3 ] || { echo 'Usage: ./admin.sh ban <email> <days>'; exit 1; }
    lc ban-user -- "$2" "$(awk -v d="$3" 'BEGIN { printf "%d", d * 86400000 }')" ;;
  password) docker compose exec studio npm run reset-password ;;
  remove)   [ $# -eq 2 ] || exit 1; docker compose exec studio npm run delete-user -- "$2" ;;
  update)   git pull --ff-only && docker compose pull -q && docker compose up -d ;;
  backup)
    mkdir -p backups
    f="backups/studio-$(date +%Y%m%d-%H%M).archive.gz"
    docker compose exec -T mongodb mongodump --archive --gzip > "$f"
    echo "Saved $f" ;;
  logs)     docker compose logs --tail=100 -f "${2:-studio}" ;;
  status)   docker compose ps ;;
  restart)  docker compose up -d && docker compose restart ;;
  *)
    cat <<'EOF'
./admin.sh user <email> "<name>" [dollars]   add a person, prints their login
./admin.sh credits <email> <dollars>         add credits (USD of AI usage)
./admin.sh set-credits <email> <dollars>     set the balance exactly
./admin.sh balances | users | stats          see people, balances, usage
./admin.sh ban <email> <days>                block someone
./admin.sh password                          reset a password (asks)
./admin.sh remove <email>                    delete a person
./admin.sh backup                            save the database to backups/
./admin.sh update | status | logs | restart  maintenance
EOF
    ;;
esac
