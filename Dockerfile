# Etapa 1: Base
FROM node:20-alpine AS base
WORKDIR /app
# Instalamos libc6-compat por si alguna librería nativa lo necesita (buena práctica en Alpine)
# RUN apk add --no-cache libc6-compat

# Etapa 2: Dependencias
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Etapa 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Construimos el proyecto
RUN yarn build

# Etapa 4: Runner (Imagen final limpia)
FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Creamos usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Copiamos solo lo necesario desde el builder
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

USER astro

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]