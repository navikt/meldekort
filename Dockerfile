FROM node:carbon

WORKDIR /usr/src/meldekort

COPY ./ ./

EXPOSE 8080

CMD ["npm", "run", "server"]