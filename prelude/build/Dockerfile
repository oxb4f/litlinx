### base
FROM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="/app:${PNPM_HOME}:${PATH}"

RUN corepack enable

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --no-optional
RUN grep -Po '@types/\S+(?=")' package.json | xargs pnpm install

COPY tsconfig*.json ./
COPY src/ src/

RUN pnpm build


### run
FROM base AS run

WORKDIR /app

ENV PATH="/app:${PNPM_HOME}:${PATH}"

COPY  --from=base /app/node_modules node_modules/
COPY  --from=base package*.json ./
COPY  --from=base tsconfig*.json ./
COPY drizzle.config.ts ./
COPY migrations ./
COPY  --from=base /app/dist dist/

ENTRYPOINT []


### test
FROM run AS test

WORKDIR /app

ENV PATH="/app:${PNPM_HOME}:${PATH}"

COPY  --from=run /app/. .
COPY  --from=base /app/package*.json ./

RUN pnpm install
ENTRYPOINT []
