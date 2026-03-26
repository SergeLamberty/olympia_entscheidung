#!/usr/bin/env bash
# =============================================================================
# logs.sh – Stream live logs from a container on the remote server
#
# Usage:
#   ./logs.sh              # streams app logs (default)
#   ./logs.sh caddy        # streams Caddy logs
#   ./logs.sh app caddy    # streams both
#   ./logs.sh --host root@other-server
# =============================================================================

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$SCRIPT_DIR/deploy.conf" ]] && source "$SCRIPT_DIR/deploy.conf"

SSH_HOST="${SSH_HOST:-}"
[[ -z "$SSH_HOST" ]] && { echo "ERROR: SSH_HOST is not set. Create deploy.conf or pass --host user@host"; exit 1; }
SSH_KEY="${SSH_KEY:-}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/wahl-check}"
SERVICES=()

while [[ $# -gt 0 ]]; do
  case $1 in
    --host) SSH_HOST="$2"; shift 2 ;;
    --key)  SSH_KEY="$2";  shift 2 ;;
    *) SERVICES+=("$1"); shift ;;
  esac
done

[[ ${#SERVICES[@]} -eq 0 ]] && SERVICES=("app")

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -t)
[[ -n "$SSH_KEY" ]] && SSH_OPTS+=(-i "$SSH_KEY")

ssh "${SSH_OPTS[@]}" "$SSH_HOST" \
  "cd $REMOTE_APP_DIR && docker compose logs -f --tail=50 ${SERVICES[*]}"
