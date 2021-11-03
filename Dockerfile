FROM node:11-alpine as builder
COPY . /source
ENV NODE_ENV production

WORKDIR /source

CMD ["npm", "run", "server"]

EXPOSE 8080

FROM docker.pkg.github.com/navikt/pus-decorator/pus-decorator
ENV APPLICATION_NAME=meldekort
# ENV NAV_DEKORATOREN_URL=https://www-q1.nav.no
ENV APPRES_CMS_URL=https://appres.nav.no/
ENV FOOTER_TYPE=WITH_ALPHABET
ENV DISABLE_FRONTEND_LOGGER=true
ENV DISABLE_UNLEASH=true
ENV EXTRA_DECORATOR_PARAMS=&chatbot=true&feedback=false
COPY --from=builder /source/build /app

RUN apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest
