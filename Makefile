.PHONY: dev build start lint format type-check \
        docker-build docker-up docker-down docker-logs \
        install setup deploy status logs

# ── Local development ─────────────────────────────────────────────────────────

dev:
npm run dev

build:
npm run build

start:
npm run start

lint:
npm run lint

format:
npm run format

type-check:
npm run type-check

install:
npm ci

# ── Local Docker (for testing production setup locally) ───────────────────────

docker-build:
docker compose build

docker-up:
docker compose up -d

docker-down:
docker compose down

docker-logs:
docker compose logs -f app

# ── Remote server operations ──────────────────────────────────────────────────

## First-time server setup and deployment
setup:
./install.sh

## Push updates to an already-configured server
deploy:
./deploy.sh

## Show container status and recent logs on the server
status:
./status.sh

## Stream live logs from the server (usage: make logs SERVICE=caddy)
logs:
./logs.sh $(SERVICE)
