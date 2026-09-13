# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:24-slim AS base
WORKDIR /server

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# ---------- deps ----------
FROM base AS deps
COPY server/package.json server/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------- prisma ----------
FROM base AS prisma
COPY --from=deps /server/node_modules ./node_modules
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY server/prisma.config.ts ./prisma.config.ts
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate --generator client_server

# ---------- dev ----------
FROM base AS dev
COPY --from=deps   /server/node_modules ./node_modules
COPY --from=prisma /server/generated    ./generated
COPY server/ .
CMD ["npx", "tsx", "sockets/index.ts"]