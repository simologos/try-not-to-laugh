FROM node:10

WORKDIR /usr/src/app

COPY package.json .
COPY lerna.json .
COPY tsconfig.base.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY packages/definition ./packages/definition
COPY packages/client ./packages/client
COPY packages/server ./packages/server
COPY packages/tsconfig.json ./packages

RUN yarn install
RUN yarn bootstrap
# RUN yarn build

COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]