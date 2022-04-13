# BASE IMAGE (46MB)
# ------------------------------------------------------------------------------------
FROM alpine:3.15 as base
RUN apk add --no-cache nodejs~=16 tini~=0.19
RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app

# DEV BUILD IMAGE (486MB)
# ------------------------------------------------------------------------------------
FROM base as build.dev
ENV SHELL=/bin/sh
RUN apk add --no-cache \
  npm~=8
RUN npm install -g pnpm

WORKDIR /usr/src

# RUN curl -L https://unpkg.com/@pnpm/self-installer | node - add --global pnpm

COPY babel.config.js nest-cli.json tsconfig.build.json tsconfig.json ./
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --unsafe-perm
COPY src ./src

# DEV API APP IMAGE (486MB)
# ------------------------------------------------------------------------------------
FROM build.dev as dev

# INCLUDE RUNTIME ARGS/ENV HERE

RUN npm run build:server
EXPOSE 3500
ENTRYPOINT ["/sbin/tini", "-v", "--"]
CMD ["npm", "run", "start"]

