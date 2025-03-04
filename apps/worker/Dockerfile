FROM node:18 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps/worker/package.json apps/worker/
COPY apps/worker/web/package.json apps/worker/web/
COPY packages packages
RUN npm install -g pnpm@10
RUN pnpm install
COPY . .
RUN pnpm turbo run build --filter=worker

FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/apps/worker/web/dist ./web/dist
COPY --from=builder /app/apps/worker/package.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/index.js"]
