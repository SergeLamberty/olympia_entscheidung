#!/usr/bin/env bash
# =============================================================================
# check_website_safety.sh – External safety checks for the live website
#
# Runs a practical set of checks similar to what public website scanners catch:
#   - DNS resolution
#   - HTTP -> HTTPS redirect
#   - TLS certificate presence and expiry window
#   - Security headers
#   - Cookie flags
#   - Sensitive file exposure
#   - TRACE method exposure
#   - Basic mixed-content / metadata sanity checks
#
# Usage:
#   ./scripts/check_website_safety.sh
#   ./scripts/check_website_safety.sh --domain example.com
#   ./scripts/check_website_safety.sh --domain example.com --verbose
# =============================================================================

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONF_FILE="$REPO_ROOT/deploy.conf"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[$(date +%H:%M:%S)]${NC} $*"; }
ok()   { echo -e "${GREEN}[$(date +%H:%M:%S)] PASS${NC} $*"; }
warn() { echo -e "${YELLOW}[$(date +%H:%M:%S)] WARN${NC} $*"; }
fail() { echo -e "${RED}[$(date +%H:%M:%S)] FAIL${NC} $*"; FAILURES=$((FAILURES + 1)); }

FAILURES=0
WARNINGS=0
VERBOSE=0
DOMAIN=""

if [[ -f "$CONF_FILE" ]]; then
  # shellcheck source=../deploy.conf
  source "$CONF_FILE"
  DOMAIN="${DOMAIN:-}"
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2 ;;
    --verbose|-v) VERBOSE=1; shift ;;
    --help|-h)
      grep '^#' "$0" | grep -v '#!/' | sed 's/^# //' | sed 's/^#//'
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

[[ -n "$DOMAIN" ]] || { echo "DOMAIN is required. Set it in deploy.conf or pass --domain." >&2; exit 1; }

require_cmd() {
  local cmd="$1"
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Missing required command: $cmd" >&2
    exit 1
  }
}

require_cmd curl
require_cmd openssl
require_cmd python3

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

http_headers_file="$TMP_DIR/http_headers.txt"
https_headers_file="$TMP_DIR/https_headers.txt"
https_body_file="$TMP_DIR/https_body.txt"
trace_headers_file="$TMP_DIR/trace_headers.txt"
cert_info_file="$TMP_DIR/cert_info.txt"

record_warn() {
  WARNINGS=$((WARNINGS + 1))
  warn "$*"
}

get_first_header() {
  local name="$1"
  local file="$2"
  python3 - "$name" "$file" <<'PY'
import sys
name = sys.argv[1].lower()
path = sys.argv[2]
value = ""
with open(path, "r", encoding="utf-8", errors="ignore") as fh:
    for raw in fh:
        line = raw.rstrip("\r\n")
        if not line:
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        if k.lower() == name:
            value = v.strip()
print(value)
PY
}

get_status_code() {
  local file="$1"
  python3 - "$file" <<'PY'
import re, sys
path = sys.argv[1]
status = ""
with open(path, "r", encoding="utf-8", errors="ignore") as fh:
    for line in fh:
        m = re.match(r"^HTTP/\S+\s+(\d+)", line.strip())
        if m:
            status = m.group(1)
print(status)
PY
}

fetch_headers() {
  local url="$1"
  local output="$2"
  curl --silent --show-error --max-time 20 --dump-header "$output" --output /dev/null "$url"
}

fetch_body() {
  local url="$1"
  local output="$2"
  curl --silent --show-error --max-time 20 --location --dump-header "$https_headers_file" --output "$output" "$url"
}

check_dns() {
  log "Checking DNS for $DOMAIN"
  local resolved_ip
  resolved_ip="$(python3 - "$DOMAIN" <<'PY'
import socket, sys
domain = sys.argv[1]
try:
    print(socket.gethostbyname(domain))
except Exception:
    print("")
PY
)"
  if [[ -n "$resolved_ip" ]]; then
    ok "DNS resolves: $DOMAIN -> $resolved_ip"
  else
    fail "DNS does not resolve for $DOMAIN"
  fi
}

check_http_redirect() {
  log "Checking HTTP to HTTPS redirect"
  if fetch_headers "http://$DOMAIN/" "$http_headers_file"; then
    local status location
    status="$(get_status_code "$http_headers_file")"
    location="$(get_first_header "location" "$http_headers_file")"
    if [[ "$status" =~ ^30[1278]$ ]] && [[ "$location" == "https://$DOMAIN/"* ]]; then
      ok "HTTP redirects to HTTPS ($status -> $location)"
    else
      fail "Expected HTTP redirect to https://$DOMAIN/, got status=${status:-none} location=${location:-none}"
    fi
  else
    fail "HTTP endpoint is not reachable at http://$DOMAIN/"
  fi
}

check_https_response() {
  log "Checking HTTPS homepage"
  if fetch_body "https://$DOMAIN/" "$https_body_file"; then
    local status content_type
    status="$(get_status_code "$https_headers_file")"
    content_type="$(get_first_header "content-type" "$https_headers_file")"
    if [[ "$status" == "200" ]]; then
      ok "HTTPS homepage responds with 200"
    else
      fail "HTTPS homepage returned status ${status:-none}"
    fi

    if [[ "$content_type" == text/html* ]]; then
      ok "Homepage content type is HTML"
    else
      record_warn "Homepage content type is unexpected: ${content_type:-missing}"
    fi
  else
    fail "HTTPS homepage is not reachable at https://$DOMAIN/"
  fi
}

check_tls_certificate() {
  log "Checking TLS certificate"
  if timeout 20 openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" </dev/null 2>/dev/null \
      | openssl x509 -noout -subject -issuer -dates >"$cert_info_file"; then
    local not_after expiry_epoch now_epoch days_left
    not_after="$(sed -n 's/^notAfter=//p' "$cert_info_file")"
    if [[ -z "$not_after" ]]; then
      fail "Could not parse certificate expiry date"
      return
    fi
    expiry_epoch="$(date -d "$not_after" +%s)"
    now_epoch="$(date +%s)"
    days_left="$(( (expiry_epoch - now_epoch) / 86400 ))"
    ok "TLS certificate is present"
    if [[ $days_left -lt 0 ]]; then
      fail "TLS certificate is expired ($not_after)"
    elif [[ $days_left -lt 21 ]]; then
      record_warn "TLS certificate expires soon: $not_after (${days_left} days left)"
    else
      ok "TLS certificate validity looks healthy: $not_after (${days_left} days left)"
    fi
    [[ $VERBOSE -eq 1 ]] && sed 's/^/  /' "$cert_info_file"
  else
    fail "Could not retrieve TLS certificate for $DOMAIN:443"
  fi
}

check_security_headers() {
  log "Checking security headers"
  local hsts xcto xfo referrer permissions csp server
  hsts="$(get_first_header "strict-transport-security" "$https_headers_file")"
  xcto="$(get_first_header "x-content-type-options" "$https_headers_file")"
  xfo="$(get_first_header "x-frame-options" "$https_headers_file")"
  referrer="$(get_first_header "referrer-policy" "$https_headers_file")"
  permissions="$(get_first_header "permissions-policy" "$https_headers_file")"
  csp="$(get_first_header "content-security-policy" "$https_headers_file")"
  server="$(get_first_header "server" "$https_headers_file")"

  [[ "$hsts" == *max-age=* ]] && ok "HSTS header is present" || fail "Missing Strict-Transport-Security header"
  [[ "${xcto,,}" == "nosniff" ]] && ok "X-Content-Type-Options is nosniff" || fail "Missing or weak X-Content-Type-Options header"
  [[ "${xfo^^}" == "SAMEORIGIN" || "${xfo^^}" == "DENY" ]] && ok "X-Frame-Options is set" || fail "Missing or weak X-Frame-Options header"
  [[ -n "$referrer" ]] && ok "Referrer-Policy is present ($referrer)" || fail "Missing Referrer-Policy header"
  [[ -n "$permissions" ]] && ok "Permissions-Policy is present" || fail "Missing Permissions-Policy header"

  if [[ -n "$server" ]]; then
    record_warn "Server header is exposed ($server)"
  else
    ok "Server header is hidden"
  fi

  if [[ -n "$csp" ]]; then
    ok "Content-Security-Policy is present"
  else
    record_warn "Content-Security-Policy is missing"
  fi
}

check_cookies() {
  log "Checking cookie flags"
  local set_cookie
  set_cookie="$(get_first_header "set-cookie" "$https_headers_file")"
  if [[ -z "$set_cookie" ]]; then
    ok "Homepage does not set cookies"
    return
  fi

  if [[ "$set_cookie" == *Secure* ]]; then
    ok "Cookies use Secure"
  else
    fail "Cookie is missing Secure"
  fi

  if [[ "$set_cookie" == *HttpOnly* ]]; then
    ok "Cookies use HttpOnly"
  else
    record_warn "Cookie is missing HttpOnly"
  fi

  if [[ "$set_cookie" == *SameSite=* ]]; then
    ok "Cookies define SameSite"
  else
    record_warn "Cookie is missing SameSite"
  fi
}

check_sensitive_paths() {
  log "Checking sensitive file exposure"
  local paths=(
    "/.env"
    "/.git/config"
    "/deploy.conf"
    "/docker-compose.yml"
    "/package.json"
    "/next.config.js"
    "/server-status"
  )
  local path code

  for path in "${paths[@]}"; do
    code="$(curl --silent --show-error --max-time 20 --location --output /dev/null --write-out '%{http_code}' "https://$DOMAIN$path")"
    if [[ "$code" == "403" || "$code" == "404" ]]; then
      ok "$path is not exposed ($code)"
    else
      fail "$path returned HTTP $code"
    fi
  done
}

check_trace_method() {
  log "Checking TRACE method exposure"
  if curl --silent --show-error --max-time 20 --request TRACE --dump-header "$trace_headers_file" --output /dev/null "https://$DOMAIN/"; then
    local status
    status="$(get_status_code "$trace_headers_file")"
    if [[ "$status" == "405" || "$status" == "400" || "$status" == "403" || "$status" == "404" || "$status" == "501" ]]; then
      ok "TRACE is not enabled (status $status)"
    else
      fail "TRACE may be enabled (status ${status:-none})"
    fi
  else
    ok "TRACE request was rejected at connection layer"
  fi
}

check_content_sanity() {
  log "Checking response body for obvious issues"
  if grep -qiE 'stack trace|exception|syntaxerror|traceback' "$https_body_file"; then
    fail "Homepage contains error-like strings"
  else
    ok "Homepage does not expose obvious stack traces"
  fi

  if grep -qE 'http://[^"'"'"' ]+' "$https_body_file"; then
    record_warn "Homepage contains http:// links; review for mixed-content risk"
  else
    ok "Homepage does not contain plain http:// links"
  fi
}

check_important_pages() {
  log "Checking important public pages"
  local path code
  local paths=("/" "/fragen" "/methodik" "/faq" "/impressum" "/datenschutz")
  for path in "${paths[@]}"; do
    code="$(curl --silent --show-error --max-time 20 --location --output /dev/null --write-out '%{http_code}' "https://$DOMAIN$path")"
    if [[ "$code" == "200" ]]; then
      ok "$path returns 200"
    else
      fail "$path returned HTTP $code"
    fi
  done
}

print_summary() {
  echo ""
  echo "Domain checked : $DOMAIN"
  echo "Failures       : $FAILURES"
  echo "Warnings       : $WARNINGS"
  echo ""
  if [[ $FAILURES -eq 0 ]]; then
    ok "Safety check completed without hard failures"
  else
    fail "Safety check completed with hard failures"
  fi
}

main() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Website Safety Check                                 ${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  check_dns
  check_http_redirect
  check_https_response
  check_tls_certificate
  check_security_headers
  check_cookies
  check_sensitive_paths
  check_trace_method
  check_content_sanity
  check_important_pages
  print_summary

  [[ $FAILURES -eq 0 ]]
}

main
