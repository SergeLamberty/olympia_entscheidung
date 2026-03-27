#!/usr/bin/env bash
# =============================================================================
# install.sh – Local orchestration script for first-time server setup
#
# Runs locally. Connects via SSH to the target server, transfers the project
# files, and executes the remote setup script.
#
# Usage:
#   ./install.sh [OPTIONS]
#
# Options:
#   --host <user@host>     Override SSH target          (default: deploy.conf)
#   --key  <path>          SSH private key path         (default: ssh-agent)
#   --domain <domain>      Public domain for HTTPS      (default: deploy.conf)
#   --email <email>        Email for TLS certs          (default: deploy.conf)
#   --app-port <port>      Internal app port            (default: 8081)
#   --remote-dir <path>    Remote project directory     (default: /opt/wahl-check)
#   --project-name <name>  Project identifier           (default: wahl-check)
#
# Example:
#   ./install.sh --domain example.com --email admin@example.com
# =============================================================================

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[$(date +%H:%M:%S)]${NC} $*"; }
ok()   { echo -e "${GREEN}[$(date +%H:%M:%S)] ✓${NC} $*"; }
warn() { echo -e "${YELLOW}[$(date +%H:%M:%S)] ⚠${NC} $*"; }
err()  { echo -e "${RED}[$(date +%H:%M:%S)] ✗ ERROR:${NC} $*" >&2; }
die()  { err "$*"; exit 1; }

# ── Load defaults from deploy.conf ───────────────────────────────────────────
CONF_FILE="${SCRIPT_DIR}/deploy.conf"
if [[ -f "$CONF_FILE" ]]; then
  # shellcheck source=deploy.conf
  source "$CONF_FILE"
  log "Loaded config from deploy.conf"
else
  warn "No deploy.conf found – using built-in defaults"
fi

# Built-in fallbacks (if deploy.conf is absent)
SSH_HOST="${SSH_HOST:-}"
SSH_KEY="${SSH_KEY:-}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/wahl-check}"
PROJECT_NAME="${PROJECT_NAME:-wahl-check}"
APP_PORT="${APP_PORT:-8081}"
DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"

# ── Parse CLI overrides ───────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --host)         SSH_HOST="$2";        shift 2 ;;
    --key)          SSH_KEY="$2";         shift 2 ;;
    --domain)       DOMAIN="$2";          shift 2 ;;
    --email)        EMAIL="$2";           shift 2 ;;
    --app-port)     APP_PORT="$2";        shift 2 ;;
    --remote-dir)   REMOTE_APP_DIR="$2";  shift 2 ;;
    --project-name) PROJECT_NAME="$2";    shift 2 ;;
    --help|-h)
      grep '^#' "$0" | grep -v '#!/' | sed 's/^# //' | sed 's/^#//'
      exit 0 ;;
    *) die "Unknown option: $1. Run ./install.sh --help for usage." ;;
  esac
done

# ── Build SSH options ─────────────────────────────────────────────────────────
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -o BatchMode=yes)
[[ -n "$SSH_KEY" ]] && SSH_OPTS+=(-i "$SSH_KEY")

ssh_run()   { ssh "${SSH_OPTS[@]}" "$SSH_HOST" "$@"; }
rsync_run() { rsync "${RSYNC_OPTS[@]}" "$@"; }

RSYNC_OPTS=(-az --delete --progress)
[[ -n "$SSH_KEY" ]] && RSYNC_OPTS+=(-e "ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new")

# ── Step 0: Validate config ───────────────────────────────────────────────────
validate_config() {
  local missing=0

  [[ -z "$SSH_HOST" ]] && {
    err "SSH_HOST is required. Set it in deploy.conf or pass --host user@host"
    missing=1
  }
  [[ -z "$DOMAIN" ]] && {
    err "DOMAIN is required for HTTPS. Set it in deploy.conf or pass --domain <domain>"
    missing=1
  }
  [[ -z "$EMAIL" ]] && {
    err "EMAIL is required for TLS certificate registration. Set it in deploy.conf or pass --email <email>"
    missing=1
  }
  if [[ $missing -eq 1 ]]; then die "Missing required configuration. Aborting."; fi
  true
  log "  SSH target   : $SSH_HOST"
  log "  Remote dir   : $REMOTE_APP_DIR"
  log "  Domain       : $DOMAIN"
  log "  App port     : $APP_PORT (internal + localhost-only host binding)"
  log "  Public access: https://$DOMAIN (HTTPS via Caddy)"
}

# ── Step 1: Check local tools ─────────────────────────────────────────────────
check_local_deps() {
  log "Checking local dependencies..."
  local missing=0
  for cmd in ssh rsync; do
    if command -v "$cmd" &>/dev/null; then
      ok "$cmd found: $(command -v "$cmd")"
    else
      err "'$cmd' is not installed locally."
      missing=1
    fi
  done
  if [[ $missing -eq 1 ]]; then die "Install missing tools and retry."; fi
  true
}

# ── Step 2: Test SSH connection ───────────────────────────────────────────────
test_ssh_connection() {
  log "Testing SSH connection to $SSH_HOST ..."
  if ssh "${SSH_OPTS[@]}" "$SSH_HOST" exit 2>/dev/null; then
    ok "SSH connection successful"
  else
    err "Cannot connect to $SSH_HOST"
    err "Ensure:"
    err "  1. Your SSH public key is in /root/.ssh/authorized_keys on the server"
    err "  2. The server is reachable: ping <your-server-ip>"
    err "  3. SSH agent is running or use --key /path/to/private_key"
    die "SSH connection failed"
  fi
}

# ── Step 3: Transfer project files ───────────────────────────────────────────
transfer_files() {
  log "Transferring project files to $SSH_HOST:$REMOTE_APP_DIR ..."

  # Bootstrap: ensure rsync is available on the remote (blank server may not have it)
  log "Ensuring rsync is available on remote server..."
  ssh_run "command -v rsync &>/dev/null || (apt-get update -qq && apt-get install -y -qq rsync)"

  # Ensure remote directory exists
  ssh_run "mkdir -p $REMOTE_APP_DIR"

  rsync_run \
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

  ok "Files transferred to $REMOTE_APP_DIR"
}

# ── Step 4: Execute remote setup ──────────────────────────────────────────────
run_remote_setup() {
  log "Starting remote setup on $SSH_HOST ..."

  # Make the remote script executable and run it with config via environment
  ssh_run "chmod +x $REMOTE_APP_DIR/scripts/remote-setup.sh"

  ssh "${SSH_OPTS[@]}" "$SSH_HOST" \
    "DOMAIN='$DOMAIN' \
     EMAIL='$EMAIL' \
     APP_PORT='$APP_PORT' \
     PROJECT_NAME='$PROJECT_NAME' \
     APP_DIR='$REMOTE_APP_DIR' \
     bash $REMOTE_APP_DIR/scripts/remote-setup.sh"
}

# ── Step 5: Verify deployment ─────────────────────────────────────────────────
verify_deployment() {
  log "Verifying app is reachable on localhost:$APP_PORT ..."
  local max=12 attempt=0

  while [[ $attempt -lt $max ]]; do
    if ssh_run "curl -sf http://localhost:$APP_PORT > /dev/null 2>&1"; then
      ok "App is responding on http://localhost:$APP_PORT (via SSH check)"
      break
    fi
    attempt=$((attempt + 1))
    warn "Not yet responding (attempt $attempt/$max) – waiting 5s..."
    sleep 5
  done

  if [[ $attempt -eq $max ]]; then
    warn "App did not respond within 60 seconds."
    warn "Check logs: ./logs.sh"
    warn "TLS provisioning may still be in progress – try https://$DOMAIN in ~60s"
  fi
}

# ── Local tests ──────────────────────────────────────────────────────────────
run_local_tests() {
  log "Running local tests before deployment..."
  if npm test 2>&1 | tail -20; then
    ok "All tests passed"
  else
    err "Tests failed. Fix test failures before deploying."
    exit 1
  fi
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Wahl-Check – Server Setup & Deployment               ${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  validate_config
  run_local_tests
  check_local_deps
  test_ssh_connection
  transfer_files
  run_remote_setup
  verify_deployment

  echo ""
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✓ Deployment complete!                               ${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  HTTPS (public): ${CYAN}https://$DOMAIN${NC}"
  echo -e "  Direct (server-local): ${CYAN}http://localhost:$APP_PORT${NC}"
  echo ""
  echo -e "  Logs   : ${YELLOW}./logs.sh${NC}"
  echo -e "  Status : ${YELLOW}./status.sh${NC}"
  echo -e "  Update : ${YELLOW}./deploy.sh${NC}"
  echo ""
}

main
