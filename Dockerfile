FROM node:16-alpine as builder
ENV NODE_ENV production

WORKDIR /var

COPY build/ build/
COPY server server/
COPY public/ public/
COPY node_modules/ node_modules/

EXPOSE 8080

ENTRYPOINT ["node", "./server/server.js"]