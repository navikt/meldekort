const fs = require('fs');
const path = require('path');
const betterSqlite3 = require('better-sqlite3');
let db;

function readFile(dir, file) {
  try {
    return fs.readFileSync(path.join(dir, file), 'utf8');
  } catch (e) {
    console.log('Error:', e.stack);
  }
}

function createJson(katalog, language) {
  const tekster = getNbAndEnTexts(katalog, language);
  return '{' + tekster + '}';
}

function getNbAndEnTexts(dir, language) {
  return read(dir, language);
}

function read(dir, language) {
  let result = [];

  fs.readdirSync(dir).forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      read(path.join(dir, file), language);
    } else {
      if (file.split('_')[1] === language + '.txt') {
        result.push(
          '"' +
            file.split('_')[0] +
            '":"' +
            readFile(dir, file)
              .trim()
              .replaceAll(/(\r\n|\n|\r)/gm, ' ')
              .replaceAll('"', '\\"') +
            '"'
        );

        db.prepare(
          'INSERT INTO texts (key, value, language, fromDateTime) VALUES (?, ?, ?, ?)'
        ).run(
          file.split('_')[0],
          readFile(dir, file)
            .trim()
            .replaceAll(/(\r\n|\n|\r)/gm, ' '),
          file.substr(-6, 2),
          '0000-00-00-00 00:00:00'
        );
      }
    }
  });

  return result.join(',');
}

try {
  db = betterSqlite3('texts.sqlite');
  db.exec('DROP TABLE IF EXISTS texts');
  db.exec(
    'CREATE TABLE texts (key TEXT, value TEXT, language TEXT, fromDateTime TEXT)'
  );

  fs.writeFileSync(
    './src/app/tekster/nb.json',
    createJson('./src/app/tekster/hjelpetekster', 'nb')
  );
  fs.writeFileSync(
    './src/app/tekster/nn.json',
    createJson('./src/app/tekster/hjelpetekster', 'nn')
  );
  fs.writeFileSync(
    './src/app/tekster/en.json',
    createJson('./src/app/tekster/hjelpetekster', 'en')
  );

  db.close();
} catch (e) {
  console.log('Kunne ikke skrive fil ', e);
}
