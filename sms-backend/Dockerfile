FROM node:24-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY sms-shared/package.json sms-shared/package.json
COPY sms-shared/tsconfig.json sms-shared/tsconfig.json
COPY sms-shared/src sms-shared/src
WORKDIR /app/sms-shared
RUN npm install && npm run build

WORKDIR /app
COPY sms-backend/package.json sms-backend/package.json
COPY sms-backend/tsconfig.json sms-backend/tsconfig.json
COPY sms-backend/prisma.config.ts sms-backend/prisma.config.ts
COPY sms-backend/prisma sms-backend/prisma
COPY sms-backend/src sms-backend/src
WORKDIR /app/sms-backend
RUN npm install
RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
