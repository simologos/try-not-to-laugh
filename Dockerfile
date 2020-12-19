FROM node:12-slim as runtime

WORKDIR /usr/src/app

COPY package*.json ./
COPY lerna.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY . .

RUN yarn install
RUN yarn bootstrap
RUN yarn build

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "execute" ]