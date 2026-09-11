# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:24-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps ----------
FROM base AS deps
COPY srcs/package.json srcs/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------- prisma ----------
FROM base AS prisma
COPY --from=deps /app/node_modules ./node_modules
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY srcs/prisma.config.ts ./prisma.config.ts
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate --generator client_app

# ---------- dev ----------
FROM base AS dev
COPY --from=deps   /app/node_modules ./node_modules
COPY --from=prisma /app/generated    ./generated
COPY srcs/ .
CMD ["npm", "run", "dev"]