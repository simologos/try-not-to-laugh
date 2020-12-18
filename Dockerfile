FROM node:15

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY packages/definition ./packages/definition
COPY packages/client ./packages/client
COPY packages/server ./packages/server

RUN yarn install --pure-lockfile --non-interactive
