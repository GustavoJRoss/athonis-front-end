# syntax=docker/dockerfile:1.7
# Imagem do painel do Athonis (Next.js, saída "standalone").
#
# NEXT_PUBLIC_API_URL entra no código no momento do build, então cada
# ambiente (staging/produção) tem a sua imagem:
#   docker build --build-arg NEXT_PUBLIC_API_URL=https://api.exemplo.com -t athonis-web .

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$NEXT_PUBLIC_API_URL" || { echo "Informe --build-arg NEXT_PUBLIC_API_URL"; exit 1; }
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node

ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION
LABEL org.opencontainers.image.description="Athonis - painel web (Next.js)"

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/',{redirect:'manual'}).then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
