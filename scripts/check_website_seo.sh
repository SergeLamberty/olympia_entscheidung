#!/usr/bin/env bash
# =============================================================================
# check_website_seo.sh – External SEO checks for the live website
#
# Checks common on-page and crawlability signals used by SEO auditing tools:
#   - HTTPS homepage availability
#   - Title and meta description presence/length
#   - Canonical URL
#   - Robots directives
#   - Open Graph and Twitter metadata
#   - html lang, viewport, and h1 presence
#   - robots.txt and sitemap.xml availability
#   - Basic structured data presence
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
DOMAIN=""

if [[ -f "$CONF_FILE" ]]; then
  # shellcheck source=../deploy.conf
  source "$CONF_FILE"
  DOMAIN="${DOMAIN:-}"
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2 ;;
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

command -v curl >/dev/null 2>&1 || { echo "Missing required command: curl" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Missing required command: python3" >&2; exit 1; }

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

headers_file="$TMP_DIR/home_headers.txt"
body_file="$TMP_DIR/home_body.html"
robots_file="$TMP_DIR/robots.txt"
sitemap_file="$TMP_DIR/sitemap.xml"

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
        if not line or ":" not in line:
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
status = ""
with open(sys.argv[1], "r", encoding="utf-8", errors="ignore") as fh:
    for line in fh:
        m = re.match(r"^HTTP/\S+\s+(\d+)", line.strip())
        if m:
            status = m.group(1)
print(status)
PY
}

get_html_field() {
  local field="$1"
  local file="$2"
  python3 - "$field" "$file" <<'PY'
import re
import sys
from html.parser import HTMLParser

field = sys.argv[1]
path = sys.argv[2]

with open(path, "r", encoding="utf-8", errors="ignore") as fh:
    html = fh.read()

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.h1_count = 0
        self.lang = ""
        self.meta_name = {}
        self.meta_property = {}
        self.links = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html" and not self.lang:
            self.lang = attrs.get("lang", "")
        elif tag == "title":
            self.in_title = True
        elif tag == "meta":
            if "name" in attrs:
                self.meta_name[attrs["name"].lower()] = attrs.get("content", "")
            if "property" in attrs:
                self.meta_property[attrs["property"].lower()] = attrs.get("content", "")
        elif tag == "link":
            self.links.append(attrs)
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "script":
            self.scripts.append(attrs)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data

parser = Parser()
parser.feed(html)

canonical = ""
manifest = ""
for link in parser.links:
    rel = link.get("rel", "")
    if isinstance(rel, str):
        rel_lower = rel.lower()
        if "canonical" in rel_lower:
            canonical = link.get("href", "")
        if "manifest" in rel_lower:
            manifest = link.get("href", "")

json_ld = any(
    script.get("type", "").lower() == "application/ld+json"
    for script in parser.scripts
)

fields = {
    "title": parser.title.strip(),
    "description": parser.meta_name.get("description", "").strip(),
    "robots": parser.meta_name.get("robots", "").strip(),
    "viewport": parser.meta_name.get("viewport", "").strip(),
    "canonical": canonical.strip(),
    "lang": parser.lang.strip(),
    "h1_count": str(parser.h1_count),
    "og:title": parser.meta_property.get("og:title", "").strip(),
    "og:description": parser.meta_property.get("og:description", "").strip(),
    "og:url": parser.meta_property.get("og:url", "").strip(),
    "og:image": parser.meta_property.get("og:image", "").strip(),
    "twitter:card": parser.meta_name.get("twitter:card", "").strip(),
    "manifest": manifest.strip(),
    "json_ld": "yes" if json_ld else "",
}

print(fields.get(field, ""))
PY
}

fetch_page() {
  curl --silent --show-error --max-time 20 --location --dump-header "$headers_file" --output "$body_file" "https://$DOMAIN/"
}

check_homepage() {
  log "Checking homepage availability"
  if fetch_page; then
    local status content_type
    status="$(get_status_code "$headers_file")"
    content_type="$(get_first_header "content-type" "$headers_file")"
    [[ "$status" == "200" ]] && ok "Homepage responds with 200" || fail "Homepage returned HTTP ${status:-none}"
    [[ "$content_type" == text/html* ]] && ok "Homepage returns HTML" || fail "Homepage content type is ${content_type:-missing}"
  else
    fail "Homepage is not reachable at https://$DOMAIN/"
  fi
}

check_title_and_description() {
  log "Checking title and meta description"
  local title description title_len description_len
  title="$(get_html_field "title" "$body_file")"
  description="$(get_html_field "description" "$body_file")"
  title_len=${#title}
  description_len=${#description}

  if [[ -n "$title" ]]; then
    ok "Title is present (${title_len} chars)"
    if (( title_len < 20 || title_len > 65 )); then
      record_warn "Title length is outside typical SEO range: ${title_len} chars"
    fi
  else
    fail "Missing <title>"
  fi

  if [[ -n "$description" ]]; then
    ok "Meta description is present (${description_len} chars)"
    if (( description_len < 70 || description_len > 170 )); then
      record_warn "Meta description length is outside typical SEO range: ${description_len} chars"
    fi
  else
    fail "Missing meta description"
  fi
}

check_indexing_directives() {
  log "Checking indexing directives"
  local robots_meta robots_header
  robots_meta="$(get_html_field "robots" "$body_file")"
  robots_header="$(get_first_header "x-robots-tag" "$headers_file")"

  if [[ -z "$robots_meta" ]]; then
    record_warn "Missing meta robots tag"
  elif [[ "${robots_meta,,}" == *noindex* ]]; then
    fail "Meta robots contains noindex"
  else
    ok "Meta robots allows indexing ($robots_meta)"
  fi

  if [[ -n "$robots_header" ]]; then
    if [[ "${robots_header,,}" == *noindex* ]]; then
      fail "X-Robots-Tag contains noindex"
    else
      ok "X-Robots-Tag is present without noindex"
    fi
  else
    ok "No X-Robots-Tag header blocking indexing"
  fi
}

check_canonical() {
  log "Checking canonical URL"
  local canonical
  canonical="$(get_html_field "canonical" "$body_file")"
  if [[ -z "$canonical" ]]; then
    fail "Missing canonical link"
  elif [[ "$canonical" == "https://$DOMAIN" || "$canonical" == "https://$DOMAIN/"* ]]; then
    ok "Canonical URL is set to this domain"
  else
    record_warn "Canonical URL points elsewhere: $canonical"
  fi
}

check_social_metadata() {
  log "Checking Open Graph and Twitter metadata"
  local og_title og_description og_url og_image twitter_card
  og_title="$(get_html_field "og:title" "$body_file")"
  og_description="$(get_html_field "og:description" "$body_file")"
  og_url="$(get_html_field "og:url" "$body_file")"
  og_image="$(get_html_field "og:image" "$body_file")"
  twitter_card="$(get_html_field "twitter:card" "$body_file")"

  [[ -n "$og_title" ]] && ok "Open Graph title is present" || fail "Missing og:title"
  [[ -n "$og_description" ]] && ok "Open Graph description is present" || fail "Missing og:description"

  if [[ -n "$og_url" ]]; then
    ok "Open Graph URL is present"
  else
    record_warn "Missing og:url"
  fi

  if [[ -n "$og_image" ]]; then
    ok "Open Graph image is present"
  else
    record_warn "Missing og:image"
  fi

  if [[ -n "$twitter_card" ]]; then
    ok "Twitter card metadata is present"
  else
    record_warn "Missing twitter:card"
  fi
}

check_document_structure() {
  log "Checking document structure"
  local lang viewport h1_count manifest
  lang="$(get_html_field "lang" "$body_file")"
  viewport="$(get_html_field "viewport" "$body_file")"
  h1_count="$(get_html_field "h1_count" "$body_file")"
  manifest="$(get_html_field "manifest" "$body_file")"

  [[ -n "$lang" ]] && ok "html lang is set ($lang)" || fail "Missing html lang"
  [[ -n "$viewport" ]] && ok "Viewport meta is present" || fail "Missing viewport meta"

  if [[ "$h1_count" == "1" ]]; then
    ok "Exactly one h1 is present"
  elif [[ "$h1_count" == "0" ]]; then
    fail "No h1 found on homepage"
  else
    record_warn "Homepage has $h1_count h1 elements"
  fi

  [[ -n "$manifest" ]] && ok "Manifest link is present" || record_warn "Missing manifest link"
}

check_crawl_files() {
  log "Checking robots.txt and sitemap.xml"
  local robots_code sitemap_code
  robots_code="$(curl --silent --show-error --max-time 20 --location --output "$robots_file" --write-out '%{http_code}' "https://$DOMAIN/robots.txt")"
  sitemap_code="$(curl --silent --show-error --max-time 20 --location --output "$sitemap_file" --write-out '%{http_code}' "https://$DOMAIN/sitemap.xml")"

  if [[ "$robots_code" == "200" ]]; then
    ok "robots.txt is available"
    if grep -qi '^sitemap:' "$robots_file"; then
      ok "robots.txt references a sitemap"
    else
      record_warn "robots.txt does not reference a sitemap"
    fi
  else
    fail "robots.txt returned HTTP $robots_code"
  fi

  if [[ "$sitemap_code" == "200" ]]; then
    ok "sitemap.xml is available"
  else
    fail "sitemap.xml returned HTTP $sitemap_code"
  fi
}

check_structured_data() {
  log "Checking structured data"
  if [[ "$(get_html_field "json_ld" "$body_file")" == "yes" ]]; then
    ok "JSON-LD structured data is present"
  else
    record_warn "No JSON-LD structured data found on homepage"
  fi
}

print_summary() {
  echo ""
  echo "Domain checked : $DOMAIN"
  echo "Failures       : $FAILURES"
  echo "Warnings       : $WARNINGS"
  echo ""
  if [[ $FAILURES -eq 0 ]]; then
    ok "SEO check completed without hard failures"
  else
    fail "SEO check completed with hard failures"
  fi
}

main() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Website SEO Check                                    ${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""

  check_homepage
  check_title_and_description
  check_indexing_directives
  check_canonical
  check_social_metadata
  check_document_structure
  check_crawl_files
  check_structured_data
  print_summary

  [[ $FAILURES -eq 0 ]]
}

main
