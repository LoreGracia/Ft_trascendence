FROM node:24-bookworm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# fck vercel
ENV NEXT_TELEMETRY_DISABLED 1

CMD npx prisma migrate dev --name init && npx prisma generate && npm run dev