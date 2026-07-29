FROM node:24-alpine

USER node

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# fck vercel
ENV NEXT_TELEMETRY_DISABLED 1

CMD npm run dev