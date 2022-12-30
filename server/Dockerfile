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

ARG IMAGE_API_KEY
ENV IMAGE_API_KEY=$IMAGE_API_KEY

RUN npm run build:server
EXPOSE 3500
ENTRYPOINT ["/sbin/tini", "-v", "--"]
CMD ["npm", "run", "start"]

