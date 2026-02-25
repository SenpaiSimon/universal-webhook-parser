ARG NODE_VERSION=22

# ---- Base Stage ----
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm install -g deno

# ---- Dependencies Stage ----
FROM base AS deps
COPY package*.json ./
# Install all dependencies (including dev dependencies needed for the build)
RUN pnpm install --prod=false

# ---- Builder Stage ----
FROM base AS builder
COPY --from=deps /app/node_modules/ ./node_modules/
COPY . .
RUN pnpm build

# ---- Production Stage ----
FROM base AS runner

# Copy only the necessary files from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# COPY Schemas
COPY --from=builder /app/src/lib/server/db ./src/lib/server/db

# IMPORTANT: Copy the drizzle folder and the entrypoint script
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]