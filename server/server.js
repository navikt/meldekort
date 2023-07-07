const express = require('express');
const compression = require('compression');
const {
  injectDecoratorServerSide,
} = require('@navikt/nav-dekoratoren-moduler/ssr');
const { logger, logRequests } = require('./logger');
const path = require('path');

const port = process.env.PORT || 8080;
const basePath = '/meldekort';
const buildPath = path.resolve(__dirname, '../build');

const app = express();

// Gzip responser
app.use(compression());

// Sikkerhetsgreier
app.disable('x-powered-by');

// Cache public-filer (som favicon) i én time
app.use(`${basePath}`, express.static('public', { maxAge: '1h' }));

console.log(`Dekoratormiljø: ${process.env.DEKORATOR_MILJO}`);

app.use(basePath, express.static(buildPath, { index: false }));

app.get(`${basePath}/internal/isAlive|isReady`, (_, res) =>
  res.sendStatus(200)
);

app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) => {
  injectDecoratorServerSide({
    env: process.env.DEKORATOR_MILJO ?? 'dev',
    filePath: `${buildPath}/index.html`,
    simple: false,
    feedback: false,
    chatbot: false,
    shareScreen: false,
  })
    .then(text => res.send(text))
    .catch(e => {
      console.error(`Failed to get decorator: ${e}`);
      res
        .status(500)
        .send('Det har oppstått en feil. Venligst prøv igjen senere.');
    });
});

app.use(logRequests);

app.listen(port, () => {
  logger.info(`Server kjører på port ${port}`);
});
