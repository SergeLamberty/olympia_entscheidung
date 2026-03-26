#!/usr/bin/env bash
# =============================================================================
# deploy.sh – Redeploy / update an already-installed server
#
# Syncs local files to the server and rebuilds containers.
# Assumes install.sh has been run at least once.
#
# Usage:
#   ./deploy.sh [--host user@host] [--key /path/to/key]
# =============================================================================

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[$(date +%H:%M:%S)]${NC} $*"; }
ok()   { echo -e "${GREEN}[$(date +%H:%M:%S)] ✓${NC} $*"; }
warn() { echo -e "${YELLOW}[$(date +%H:%M:%S)] ⚠${NC} $*"; }

# Load config
[[ -f "$SCRIPT_DIR/deploy.conf" ]] && source "$SCRIPT_DIR/deploy.conf"
SSH_HOST="${SSH_HOST:-}"
[[ -z "$SSH_HOST" ]] && { echo -e "${RED}ERROR:${NC} SSH_HOST is not set. Create deploy.conf or pass --host user@host"; exit 1; }
SSH_KEY="${SSH_KEY:-}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/wahl-check}"

# Parse overrides
while [[ $# -gt 0 ]]; do
  case $1 in
    --host) SSH_HOST="$2"; shift 2 ;;
    --key)  SSH_KEY="$2";  shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -o BatchMode=yes)
RSYNC_OPTS=(-az --delete --progress)
[[ -n "$SSH_KEY" ]] && SSH_OPTS+=(-i "$SSH_KEY") && RSYNC_OPTS+=(-e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new")

log "Syncing files to $SSH_HOST:$REMOTE_APP_DIR ..."

rsync "${RSYNC_OPTS[@]}" \
  --exclude='.next/' \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='.env.local' \
  --exclude='.env' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --filter=':- .gitignore' \
  "$SCRIPT_DIR/" \
  "$SSH_HOST:$REMOTE_APP_DIR/"

ok "Files synced"

log "Rebuilding and restarting containers..."
ssh "${SSH_OPTS[@]}" "$SSH_HOST" \
  "cd $REMOTE_APP_DIR && docker compose up --build -d --remove-orphans"

ok "Deployment complete – https://$(grep '^DOMAIN=' "$SCRIPT_DIR/deploy.conf" 2>/dev/null | cut -d= -f2 || echo '<domain>')"
