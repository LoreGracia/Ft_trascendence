FROM node:24-bookworm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# fck vercel
ENV NEXT_TELEMETRY_DISABLED 1

CMD npm run dev