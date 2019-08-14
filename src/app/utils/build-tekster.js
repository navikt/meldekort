const fs = require('fs');
const path = require('path');

function readFile(dir, file) {
  try {
    return fs.readFileSync(path.join(dir, file), 'utf8');
  } catch (e) {
    console.log('Error:', e.stack);
  }
}
function createJson(katalog) {
  const tekster = getNbAndEnTexts(katalog);
  return "/*tslint:disable*/export default {'nb':{" + tekster[0] + "},'en':{" + tekster[1] + '}};';
}

function getNbAndEnTexts(dir) {
  return read(dir, '', '');
}

function read(dir, nb, en) {
  fs.readdirSync(dir).forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      [nb, en] = read(path.join(dir, file), nb, en);
    } else {
      file.split('_')[1] === 'nb.txt'
        ? (nb = nb + skrivFilTilSprak(file, dir, '_nb.txt'))
        : (en = en + skrivFilTilSprak(file, dir, '_en.txt'));
    }
  });

  return [nb, en];
}

function skrivFilTilSprak(fil, dir, splitStr) {
  filename =
    "'" +
    fil.split(splitStr)[0] +
    "'" +
    ':' +
    "'" +
    readFile(dir, fil)
      .trim()
      .replace(/(\r\n|\n|\r)/gm, ' ') +
    " ',";
  return filename;
}

try {
  fs.writeFileSync(
    './src/app/tekster/kompilerte-tekster.ts',
    createJson('./src/app/tekster/hjelpetekster')
  );
} catch (e) {
  console.log('Kunne ikke skrive fil ', e);
}

console.log(getNbAndEnTexts('./src/app/tekster/hjelpetekster'));
