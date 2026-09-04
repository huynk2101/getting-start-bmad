FROM node:24-slim AS base
WORKDIR /app

COPY sms-shared/package.json sms-shared/package.json
COPY sms-shared/tsconfig.json sms-shared/tsconfig.json
COPY sms-shared/src sms-shared/src
WORKDIR /app/sms-shared
RUN npm install && npm run build

WORKDIR /app
COPY sms-frontend/package.json sms-frontend/package.json
COPY sms-frontend/tsconfig.json sms-frontend/tsconfig.json
COPY sms-frontend/vite.config.ts sms-frontend/vite.config.ts
COPY sms-frontend/index.html sms-frontend/index.html
COPY sms-frontend/src sms-frontend/src
WORKDIR /app/sms-frontend
RUN npm install

EXPOSE 5173
CMD ["npm", "run", "dev"]
