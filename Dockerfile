FROM docker.adeo.no:5000/pus/node as builder
WORKDIR /usr/src/app
COPY . ./

RUN npm install && npm run build
ENV NODE_ENV production

EXPOSE 8080
CMD ["npm", "run", "server"]

FROM docker.adeo.no:5000/pus/decorator
ENV APPLICATION_NAME=meldekort
COPY --from=builder /build /app