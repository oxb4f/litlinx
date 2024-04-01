### base
FROM oven/bun:alpine AS base

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./

COPY src/ src/

RUN bun install


### run
FROM base AS run

RUN mkdir -p /app
WORKDIR /app

COPY  --from=base /app/node_modules node_modules/
COPY  --from=base package*.json ./
COPY tsconfig*.json ./
COPY drizzle.config.ts ./
COPY migrations ./

ENTRYPOINT []


### test
FROM run AS test

RUN mkdir -p /app
WORKDIR /app

COPY  --from=run /app/. .
COPY  --from=base /app/package*.json ./

RUN bun install

ENTRYPOINT []
