FROM node:16-alpine as builder
COPY . /source
ENV NODE_ENV production

WORKDIR /source

CMD ["npm", "run", "server"]

EXPOSE 8080

FROM ghcr.io/navikt/pus-decorator/pus-decorator
ENV APPLICATION_NAME=meldekort
ENV APPRES_CMS_URL=https://appres.nav.no/
ENV FOOTER_TYPE=WITH_ALPHABET
ENV DISABLE_FRONTEND_LOGGER=true
ENV DISABLE_UNLEASH=true
ENV EXTRA_DECORATOR_PARAMS=&chatbot=true&feedback=false
COPY --from=builder /source/build /app
