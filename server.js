const betterSqlite3 = require('better-sqlite3');
const url = require('url');
const http = require('http');

const port = process.env.PORT || 8080;
const basePath = '/texts';

http
  .createServer(function(req, res) {
    try {
      // CORS policy
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      const { path, id, language, time } = parseUrl(req);
      const db = new betterSqlite3('texts.sqlite');

      if (path === basePath + '/exists') {
        const result = getOne(db, id, language, time);

        // result is undefined if nothing has been found
        let value = id.split('-')[0];
        if (result) {
          value = id;
        }

        res.end(value);
      } else if (path === basePath + '/get') {
        // result is undefined if nothing has been found
        const result = getOne(db, id, language, time);

        let value = id;
        if (result) {
          value = result.value;
        }

        res.end(value);
      } else if (path === basePath + '/getall') {
        const result = getAll(db, language, time);

        res.end(JSON.stringify(result));
      } else {
        res.statusCode = 404;
        res.end();
      }

      db.close();
    } catch (e) {
      console.log(e);
    }
  })
  .listen(port, function(err) {
    if (err) throw err;
    console.log('Listening on ' + port);
  });

function parseUrl(req) {
  const parsedUrl = url.parse(req.url, true);
  const queryObject = parsedUrl.query;

  const id = queryObject.id;
  const language = queryObject.language;

  // YYYY-MM-DD HH:MI:SS
  let time = queryObject.from;
  if (!time) {
    const currentDate = new Date();
    time =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate
        .getDate()
        .toString()
        .padStart(2, '0') +
      ' ' +
      currentDate
        .getHours()
        .toString()
        .padStart(2, '0') +
      ':' +
      currentDate
        .getMinutes()
        .toString()
        .padStart(2, '0') +
      ':' +
      currentDate
        .getSeconds()
        .toString()
        .padStart(2, '0');
  }

  return {
    path: parsedUrl.pathname,
    id,
    language,
    time,
  };
}

function getOne(db, id, language, time) {
  return db
    .prepare(
      'SELECT value ' +
        'FROM texts ' +
        'WHERE key = ? ' +
        'AND language = ? ' +
        'AND fromDateTime <= ? ' +
        'ORDER BY datetime(fromDateTime) DESC'
    )
    .get(id, language, time);
}

function getAll(db, language, time) {
  // result is an array of row objects
  // The array will be empty if nothing has been found
  const result = db
    .prepare(
      'SELECT key, value ' +
        'FROM texts ' +
        'WHERE language = ? ' +
        'AND fromDateTime <= ? ' +
        'ORDER BY datetime(fromDateTime) DESC'
    )
    .all(language, time);

  // Convert from array of row objects to object containing all key-value pairs
  const texts = {};
  for (const row of result) {
    texts[row.key] = row.value;
  }

  return texts;
}
