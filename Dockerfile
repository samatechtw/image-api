FROM ubuntu:18.04

WORKDIR /usr/src

RUN apt update
RUN apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

RUN node -v
RUN npm -v

COPY babel.config.js nest-cli.json package.json package-lock.json rollup.config.ts tsconfig.build.json tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build:cp
RUN npm run build:app
RUN npm run start

