# Wahl-Check

A mobile-first Progressive Web App (PWA) for German municipal election guidance. Users answer theses about local policy positions and see which position matches their views best.

Built for the **Ratsbürgerentscheid Düsseldorf – Olympia-Bewerbung Rhein-Ruhr 2026**.

## Features

- **Content-driven app** – editorial content comes from local JSON files in `/content/`
- **PWA** – installable, works offline after first visit
- **Local answer storage** – quiz answers stay in browser `localStorage`
- **Lightweight server analytics** – counts unique visitors, completed runs, and average score via an internal API and a host-mounted `/data` directory
- **Mobile-first** – optimised for phones, accessible on all screen sizes
- **Neutral information section** – factual overview of the referendum at `/info`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS |
| PWA | next-pwa (Workbox) |
| State | React Context + localStorage |
| Analytics | Next.js route handler + JSON file in `/data` |
| Deployment | Docker + Caddy (automatic HTTPS) |
| Node | LTS 20 |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (PWA service worker disabled in dev)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Type Checking & Linting

```bash
npm run type-check
npm run lint
npm run format
```

Note: `npm run type-check` currently fails because the Jest test files are included without Jest globals in `tsconfig.json`. `npm run build` is the more reliable validation step for the app at the moment.

---

## Deployment

### Architecture

```
Internet
  │
  ├─ :80  (HTTP)  ─► Caddy container  ─► redirect to HTTPS
  └─ :443 (HTTPS) ─► Caddy container  ─► app:8081 (Docker network)
                                              │
                                         Next.js container
                                         (listens on :8081)
                                              │
                                        :8081 exposed on host
                                        (for direct access / debugging)
```

**Port summary:**

| Port | Direction | Purpose |
|---|---|---|
| 22 | inbound | SSH (admin access) |
| 80 | inbound | HTTP → HTTPS redirect + ACME challenge |
| 443 | inbound | HTTPS (public access) |
| 8081 | inbound | Direct app access (debug / monitoring) |
| 8081 | internal | App container listens here |

Caddy obtains and renews TLS certificates automatically via Let's Encrypt.

---

### Prerequisites (local machine)

- `ssh` installed
- `rsync` installed
- SSH key authorised on the target server (`~/.ssh/authorized_keys` for root)
- DNS A record for your domain pointing to your server IP

Check:
```bash
ssh -o BatchMode=yes root@your-server exit && echo "SSH OK"
dig +short yourdomain.com  # should return your server IP
```

---

### Configuration (`deploy.conf`)

All deployment parameters live in `deploy.conf` at the project root.
Copy the example and fill in your values:

```bash
cp deploy.conf.example deploy.conf
```

```bash
SSH_HOST="root@your-server"       # Target server
SSH_KEY=""                        # Path to SSH key (empty = use ssh-agent)
REMOTE_APP_DIR="/opt/wahl-check"  # Where the app lives on the server
PROJECT_NAME="wahl-check"         # Container name prefix
APP_PORT="8081"                   # Internal port (app + host-exposed)
DOMAIN="yourdomain.com"           # Public domain (must have DNS set up)
EMAIL="admin@yourdomain.com"      # For Let's Encrypt certificate
```

Override any value via CLI without editing the file:
```bash
./install.sh --domain example.com --email admin@example.com
./install.sh --host root@other-server --key ~/.ssh/other_key
```

---

### First-Time Server Setup

```bash
# Full automated setup (run once on a blank Ubuntu server):
./install.sh

# Or with overrides:
./install.sh --domain example.com --email admin@example.com

# Or via make:
make setup
```

`install.sh` will:

1. Validate local tools (`ssh`, `rsync`)
2. Test SSH connectivity
3. Transfer all project files via `rsync`
4. On the server:
   - Install base packages + Docker Engine (official method)
   - Configure UFW firewall
   - Generate `/opt/wahl-check/.env` automatically (no manual step)   - Build Docker image and start all containers
   - Install a systemd service for auto-restart on reboot
5. Verify the app responds on port 8081

**No `.env` file needs to be created manually.** `install.sh` generates it on the server.

---

### Update / Redeploy

After content or code changes:

```bash
./deploy.sh

# Or:
make deploy
```

This syncs files and rebuilds containers without touching the server's `.env`.

### Analytics Storage

The app stores anonymous usage statistics in `/data/analytics.json` inside the app container. In Docker Compose this path is bind-mounted from the server host's `/data` directory, so counters survive container rebuilds and restarts and are directly visible on the server.

Tracked values:

- unique visitors (deduplicated by a first-party cookie)
- completed quiz runs
- average result score

The internal statistics page is available at `/intern/statistik` and is marked `noindex`.

---

### Status & Logs

```bash
./status.sh          # Container status + recent logs
./logs.sh            # Stream app logs (Ctrl+C to stop)
./logs.sh caddy      # Stream Caddy logs
make status
make logs SERVICE=caddy
```

---

### HTTPS

Caddy handles TLS automatically:

- Certificate is obtained from Let's Encrypt on first start (~60 seconds)
- Certificate is stored in the `caddy_data` Docker volume (persists across restarts)
- Renewal is automatic (no cron job needed)
- HTTP is automatically redirected to HTTPS

If HTTPS does not work after 60 seconds:
```bash
./logs.sh caddy   # Look for ACME errors
```

Common causes:
- DNS not yet pointing to the server
- Port 80 not open in firewall (needed for ACME HTTP challenge)

---

### Reboot Behaviour

A systemd service (`wahl-check.service`) is installed during setup. After a server reboot, Docker and all containers start automatically. No manual intervention is needed.

Check the service:
```bash
ssh root@your-server "systemctl status wahl-check"
```

---

### Updating Content

All content lives in `/content/` and is mounted read-only into the container:

| File | What to edit |
|---|---|
| `content/site.json` | Site title, nav, hero text, footer |
| `content/questions.json` | Quiz questions / theses |
| `content/results.json` | Positions and their stances |
| `content/faq.json` | General FAQ |
| `content/info/overview.json` | Referendum facts |
| `content/info/process.json` | Voting process steps |
| `content/info/arguments.json` | Pro/Contra arguments |
| `content/info/faq.json` | Info section FAQ |
| `content/info/sources.json` | Source links |

To update content without rebuilding the container:
```bash
rsync -az content/ root@your-server:/opt/wahl-check/content/
# No container restart needed (content is mounted live)
```

To update code:
```bash
./deploy.sh  # Syncs + rebuilds
```

---

### PWA

- The app is installable as a PWA on Android and iOS
- Offline support for static assets via Workbox service worker
- Service worker is disabled in `npm run dev` (enabled in production build only)
- Manifest is at `/public/manifest.json`
- Icons are at `/public/icons/` – replace with your own 192×192 and 512×512 PNG files

---

### Troubleshooting

**App does not start:**
```bash
./logs.sh app
ssh root@your-server "cd /opt/wahl-check && docker compose ps"
```

**HTTPS certificate not obtained:**
```bash
./logs.sh caddy
# Check DNS: dig +short yourdomain.com
# Check port 80 is open: ./status.sh
```

**Container not auto-starting after reboot:**
```bash
ssh root@your-server "systemctl status wahl-check docker"
ssh root@your-server "journalctl -u wahl-check -n 50"
```

**Reset and redeploy from scratch:**
```bash
ssh root@your-server "cd /opt/wahl-check && docker compose down -v"
./install.sh
```

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Next.js standalone output** | Smaller Docker image; no `node_modules` needed at runtime |
| **Caddy over Nginx** | Automatic TLS renewal, single config file, no certbot needed |
| **App on port 8081** | Avoids conflict with system services on 3000/8080; host-exposed for monitoring |
| **Content as mounted volume** | Content updates don't require container rebuild |
| **No database server** | Content is static JSON; quiz answers stay in browser localStorage; analytics are persisted as a small JSON file in `/data` |
| **`deploy.conf` over `.env`** | Single source of truth for both local scripts and documentation; `.env` is generated server-side; `deploy.conf` is gitignored |
| **Systemd service** | Ensures containers restart after reboot without depending on Docker restart policies alone |

---

## Project Structure

```
.
├── content/              # All editable content (JSON)
│   ├── site.json
│   ├── questions.json
│   ├── results.json
│   ├── faq.json
│   └── info/
│       ├── overview.json
│       ├── process.json
│       ├── arguments.json
│       ├── faq.json
│       └── sources.json
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # UI + layout + feature components
│   ├── context/          # QuizContext (React state)
│   ├── lib/              # content-loader, info-loader, storage, matching, analytics
│   └── types/            # TypeScript types
├── public/               # Static assets, manifest, PWA icons
├── scripts/
│   └── remote-setup.sh   # Runs on server (called by install.sh)
├── deploy.conf.example   # Deployment configuration template (copy to deploy.conf)
├── install.sh            # First-time server setup (run locally)
├── deploy.sh             # Push updates (run locally)
├── status.sh             # Check server status (run locally)
├── logs.sh               # Stream server logs (run locally)
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # App + Caddy services
├── Caddyfile             # Reverse proxy + TLS config
└── Makefile              # Convenience targets
```
