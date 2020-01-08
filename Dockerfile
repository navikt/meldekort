FROM node:11-alpine as builder
COPY . /source
ENV NODE_ENV production

WORKDIR /source

CMD ["npm", "run", "server"]

EXPOSE 8080

FROM navikt/pus-decorator
ENV APPLICATION_NAME=meldekort
ENV NAV_DEKORATOREN_URL=https://www-q0.nav.no/person/nav-dekoratoren/
ENV FOOTER_TYPE=WITH_ALPHABET
COPY --from=builder /source/build /app