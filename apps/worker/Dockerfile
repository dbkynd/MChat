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
RUN pnpm install
COPY --from=turbo /app/out/full/ .
RUN pnpm run build

FROM node:22-slim AS runner
WORKDIR /app
COPY --from=installer /app ./
EXPOSE 3000
CMD ["node", "apps/worker/dist/index.js"]
