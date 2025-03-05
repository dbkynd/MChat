FROM node:22 AS base
WORKDIR /app
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install -g pnpm@latest-10

FROM base AS turbo
RUN pnpm add turbo --global
COPY . .
RUN turbo prune worker --docker

FROM base AS installer
COPY --from=turbo /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=turbo /app/out/full/ .
RUN pnpm run build

FROM node:22-slim AS runner
WORKDIR /app
COPY --from=installer /app/apps/worker/node_modules ./node_modules
COPY --from=installer /app/apps/worker/dist ./dist
COPY --from=installer /app/apps/worker/web/dist ./web/dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
