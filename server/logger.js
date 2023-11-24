const winston = require('winston');

const logger = winston.createLogger({
  format:
    process.env.NODE_ENV === 'development'
      ? winston.format.simple()
      : winston.format.json(),
  transports: new winston.transports.Console()
});

const logRequests = (request, res, next) => {
  const method = request.method;
  const url = request.url;

  logger.info(`${method} ${url}`);

  next();
};

module.exports = { logger, logRequests };
