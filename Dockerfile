# The site prerenders to a folder of files, so production needs a file server,
# not a Node runtime. The Node stages exist only to produce dist/.

# ── Build ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ── Runtime ────────────────────────────────────────────────────────────
FROM caddy:2-alpine AS runner

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv

# Fails the build instead of shipping a container that 404s everything.
RUN caddy validate --config /etc/caddy/Caddyfile \
    && test -f /srv/index.html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --spider -q http://127.0.0.1/healthz || exit 1

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
