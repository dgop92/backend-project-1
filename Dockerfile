FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine AS server

WORKDIR /app

COPY package* ./

RUN npm ci --only=production

COPY --from=builder ./app/dist ./dist
COPY --from=builder ./app/tsconfig.json ./tsconfig.json
COPY --from=builder ./app/scripts/prod-setup.js ./scripts/prod-setup.js

EXPOSE 8000

CMD ["node", "-r", "./scripts/prod-setup.js", "dist/main/index.js"]