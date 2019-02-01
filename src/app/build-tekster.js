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
                filename = "'" + file.split('_')[0] + "'" + ':' + "'" + readFile(dir, file).trim().replace(/\n|\r|\r\n/, ' ') + "',";
                file.split('_')[1] === 'nb.txt' ?
                    nb = nb + filename : en = en + filename;
            }
        });

    return [nb, en]
}


try{
    fs.writeFileSync('./src/tekster/alle-tekster.ts', createJson('./src/tekster/hjelpetekster'));
}catch (e){
    console.log("Kunne ikke skrive fil ", e);
}

console.log(getNbAndEnTexts('./src/tekster/hjelpetekster'));