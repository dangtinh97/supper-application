FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
RUN apk add --no-cache python3 py3-pip && ln -sf /usr/bin/python3 /usr/bin/python
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm install
RUN pnpm run build

FROM base AS runner
WORKDIR /app
# ENV NODE_ENV production
COPY --from=builder --chown=node:node /app/dist/ ./dist/
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/.env ./.env

USER node
EXPOSE 3000

CMD [ "node", "dist/main.js" ]
