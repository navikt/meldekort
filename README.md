# Meldekort
Meldekort er et webgrensesnitt for brukere til å fylle ut og sende inn meldekort til NAV.
Meldekort tilbyr påloggende arbeidssøkere å se sin meldekorthistorikk, samt å fylle ut og sende inn meldekort.

## Dokumentasjon
Dokumentasjon finnes i [Confluence](https://confluence.adeo.no/display/TA/Meldekort).
Om Meldekort journalføring: https://confluence.adeo.no/pages/viewpage.action?pageId=431009242

## Tekster
Denne appen har en mekanisme for tekstversjonering. Dvs. appen viser gjeldende versjon av tekstene som var gyldige i
begynnelsen av meldeperioden til aktivt meldekort. Hvis meldekort ikke er valgt, viser appen den nyeste versjonen av
tekstene. Tekstene er lagret i en DB og derfor må vi gå gjennom meldekort-api og meldekortservice for å nå dem.

For å endre tekstene (eller opprette nye versjoner), må man endre fil R__recreate_texts.sql i meldekort-api og deploye
meldekort-api på nytt. Dette gir mulighet for å teste endringer i DEV/QA først og hindrer direkte endringer i prod DB.

OBS! Meldekort-frontend har også cache for tekstene (30 minutter), dvs. appen skal ikke prøve å hente tekstene med samme
språk og gyldighetstid på nytt i løpet av 30 minutter.

## Henvendelser
Spørsmål knyttet til koden eller prosjekt rettes til:

* Mona Kjeldsrud, mona.kjeldsrud@nav.no

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-meldeplikt / #meldekort

## For utviklere
OBS! Man bør ha minst npm versjon 7 siden package-lock.json er på lockfileVersion 2 nå.

### Start applikasjonen lokalt
1. Last ned npm-pakker med `npm install --legacy-peer-deps`.
2. Kjør `npm start`. Appen starter da på [http://localhost:3000](http://localhost:3000).
3. Hvis man vil kjøre appen i mock-modus (uten meldekort-api kjørende lokalt) starter man appen med `npm run start:mock`

For de som utvikler på tynnklienten, må disse to linjer med kode settes øverst i .npmrc-filen før npm install fungerer.
* `proxy=http://155.55.60.117:8088/`
* `https-proxy=http://155.55.60.117:8088/`

### Andre tilgjengelige kommandoer
* `npm test` kjører testene.
* `npm run build` bygger appen for produksjon.
