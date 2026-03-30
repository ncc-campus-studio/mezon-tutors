FROM node:22.22.2-trixie-slim AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY packages packages
COPY apps/api apps/api

RUN corepack enable && yarn install

RUN yarn build
RUN cd apps/api && yarn build

FROM node:22.22.2-trixie-slim

WORKDIR /app

COPY --from=builder /app .

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["node", "dist/main.js"]
