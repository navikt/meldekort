FROM node:11-alpine
# RUN apk add --no-cache bash
COPY . /source
ENV NODE_ENV production

WORKDIR /source
RUN npm install && npm run build

CMD ["npm", "run", "server"]

EXPOSE 8080

FROM navikt/pus-decorator
ENV APPLICATION_NAME=meldekort
ENV FOOTER_TYPE=WITH_ALPHABET
COPY --from=builder /source/build /app