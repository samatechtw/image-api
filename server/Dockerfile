# BASE IMAGE (46MB)
# ------------------------------------------------------------------------------------
FROM node:16.19.0-alpine3.17 as base
RUN apk add --no-cache tini~=0.19
RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app

# DEV BUILD IMAGE (486MB)
# ------------------------------------------------------------------------------------
FROM base as build.dev
ENV SHELL=/bin/sh
RUN npm install -g pnpm

WORKDIR /usr/src

COPY package.json ./
COPY pnpm-*.yaml ./
COPY tsconfig*.json ./
COPY types ./types
COPY lib ./lib
COPY server ./server
RUN pnpm install -r --frozen-lockfile --unsafe-perm --production

# DEV API APP IMAGE (486MB)
# ------------------------------------------------------------------------------------
FROM build.dev as dev

ARG API_AUTHORIZED_REFERRERS
ENV API_AUTHORIZED_REFERRERS=$API_AUTHORIZED_REFERRERS
ARG IMAGE_API_KEY
ENV IMAGE_API_KEY=$IMAGE_API_KEY
ARG IMAGE_API_PORT
ENV IMAGE_API_PORT=$IMAGE_API_PORT
ARG IMAGE_API_REDIS_HOST
ENV IMAGE_API_REDIS_HOST=$IMAGE_API_REDIS_HOST
ARG IMAGE_API_REDIS_PORT
ENV IMAGE_API_REDIS_PORT=$IMAGE_API_REDIS_PORT

RUN npm run build:server

ENTRYPOINT ["/sbin/tini", "-v", "--"]
CMD ["npm", "run", "start"]

