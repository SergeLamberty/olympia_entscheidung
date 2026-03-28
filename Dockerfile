FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/olympia/package.json ./apps/olympia/

# Install dependencies for olympia app only
RUN pnpm install --frozen-lockfile --filter olympia

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/olympia/node_modules ./apps/olympia/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/olympia ./apps/olympia
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app/apps/olympia
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Install wget for container health checks
RUN apk add --no-cache wget
RUN mkdir -p /data && chown nextjs:nodejs /data

COPY --from=builder /app/apps/olympia/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/olympia/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/olympia/.next/static ./.next/static
COPY --from=builder /app/apps/olympia/content ./content

USER nextjs
# PORT is set via docker-compose environment (default 8081 in production)
EXPOSE 8081
ENV PORT 8081
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
