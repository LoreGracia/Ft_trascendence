FROM node:24-bookworm

WORKDIR /server

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# fck vercel
ENV NEXT_TELEMETRY_DISABLED 1

CMD npx tsx sockets/index.ts