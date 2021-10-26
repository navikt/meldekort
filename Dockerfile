FROM node:11-alpine as builder
COPY . /source
ENV NODE_ENV production

WORKDIR /source

CMD ["npm", "run", "server"]
CMD ["npm", "run", "start:backend"]

EXPOSE 8080
EXPOSE 8081

FROM docker.pkg.github.com/navikt/pus-decorator/pus-decorator
ENV APPLICATION_NAME=meldekort
# ENV NAV_DEKORATOREN_URL=https://www-q1.nav.no
ENV APPRES_CMS_URL=https://appres.nav.no/
ENV FOOTER_TYPE=WITH_ALPHABET
ENV DISABLE_FRONTEND_LOGGER=true
ENV DISABLE_UNLEASH=true
ENV EXTRA_DECORATOR_PARAMS=&chatbot=true&feedback=false
COPY --from=builder /source/build /app
