#!/usr/bin/env bash
# =============================================================================
# status.sh – Show running container status and recent logs
#
# Usage: ./status.sh [--host user@host] [--key /path/to/key]
# =============================================================================

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$SCRIPT_DIR/deploy.conf" ]] && source "$SCRIPT_DIR/deploy.conf"

SSH_HOST="${SSH_HOST:-}"
[[ -z "$SSH_HOST" ]] && { echo "ERROR: SSH_HOST is not set. Create deploy.conf or pass --host user@host"; exit 1; }
SSH_KEY="${SSH_KEY:-}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/wahl-check}"

while [[ $# -gt 0 ]]; do
  case $1 in
    --host) SSH_HOST="$2"; shift 2 ;;
    --key)  SSH_KEY="$2";  shift 2 ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -o BatchMode=yes)
[[ -n "$SSH_KEY" ]] && SSH_OPTS+=(-i "$SSH_KEY")

ssh "${SSH_OPTS[@]}" "$SSH_HOST" <<REMOTE
  echo ""
  echo "=== Container Status ==="
  cd $REMOTE_APP_DIR
  docker compose ps

  echo ""
  echo "=== UFW Status ==="
  ufw status numbered

  echo ""
  echo "=== Recent App Logs (last 30 lines) ==="
  docker compose logs --tail=30 app

  echo ""
  echo "=== Caddy Logs (last 10 lines) ==="
  docker compose logs --tail=10 caddy
REMOTE
