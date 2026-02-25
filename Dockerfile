# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN #npm install -g pnpm
# enable corepack (pnpm)
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Chỉ giữ production dependencies
RUN pnpm prune --prod


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy production deps + build output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views

EXPOSE 3000

CMD ["node", "dist/main.js"]