FROM node:22-bookworm-slim AS builder
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare yarn@4.11.0 --activate
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/app/package.json packages/app/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/
RUN yarn config set enableScripts false \
  && yarn install --mode=skip-build \
  && yarn cache clean --all \
  && rm -rf /root/.yarn
COPY . .
RUN yarn config set enableScripts false && yarn install --mode=skip-build
RUN printf '%s\n' 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dummy?schema=public' > packages/db/.env
RUN ./node_modules/.bin/turbo run build --filter=@mezon-tutors/api

FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
COPY scripts/docker-api-entrypoint.sh /usr/local/bin/docker-api-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-api-entrypoint.sh
EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/docker-api-entrypoint.sh"]
