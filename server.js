const express = require('express');
const betterSqlite3 = require('better-sqlite3');
const url = require('url');

const db = new betterSqlite3('texts.sqlite');
const app = express();

const basePath = '/texts';

app.get(basePath + '/exists', function(req, res) {
  const { id, language, time } = parseUrl(req);

  // result is undefined if nothing has been found
  const result = getOne(db, id, language, time);

  let value = id.split('-')[0];
  if (result) {
    value = id;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(value);
});

app.get(basePath + '/getall', function(req, res) {
  const { language, time } = parseUrl(req);
  const result = getAll(db, language, time);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(result));
});

app.get(basePath + '/get', function(req, res) {
  const { id, language, time } = parseUrl(req);

  // result is undefined if nothing has been found
  const result = getOne(db, id, language, time);

  let value = queryObject.id;
  if (result) {
    value = result.value;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(value);
});

app.use('/meldekort', express.static(__dirname));
app.use('/', express.static(__dirname));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
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
