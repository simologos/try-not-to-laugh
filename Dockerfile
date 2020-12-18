FROM node:10

WORKDIR /usr/src/app

COPY packages/server/dist/packages/server/src .
COPY packages/server/node_modules .

COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]