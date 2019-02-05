const fs = require('fs');
const path = require('path');

function readFile(dir, file) {
    try {
        return fs.readFileSync(path.join(dir, file), 'utf8');
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function createJson(katalog) {
    const tekster = getNbAndEnTexts(katalog);
    return '/*tslint:disable*/export default {\'nb\':{' + tekster[0] + '},\'en\':{' + tekster[1] + '}};';
}

function getNbAndEnTexts(dir) {
    return read(dir, "", "");
}

function read(dir, nb, en) {
    let filename = "";
    fs.readdirSync(dir)
        .forEach((file) => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                [nb, en] = read(path.join(dir, file), nb, en);
            }
            else {
                if ( file.slice(-4) === '.txt') {
                    filename = "'" + file.split('_en.txt'|| '_nb.txt')[0] + "'" + ':' + "'" + readFile(dir, file).trim().replace(/\n|\r|\r\n/, ' ') + "',";
                    file.split('_')[1] === ('nb.txt' || 'AAP_nb.txt') ?
                        nb = nb + filename : en = en + filename;
                } else if (file.slice(-5) === '.html' && file.split('_nb.html')[0] === 'forklaring.sporsmal.aktivitet_arbeid_aap') {
                    console.log(file, ' ====== vår testfiler');

                }
                // Hvis ikke .txt, så html-fil.
                else {
                    console.log(file, ' er en html-fil.');
                }
            }
        });

    return [nb, en]
}

try{
    fs.writeFileSync('./src/app/tekster/alle-tekster.ts', createJson('./src/app/tekster/hjelpetekster'));
}catch (e){
    console.log("Kunne ikke skrive fil ", e);
}

console.log( getNbAndEnTexts('./src/app/tekster/hjelpetekster'));