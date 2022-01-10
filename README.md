# Meldekort
Meldekort er et webgrensesnitt for brukere å sende inn utfylte meldekort-skjema til NAV.
Meldekort tilbyr påloggende arbeidssøkere å se sin meldekorthistorikk samt å fylle ut og sende inn meldekort.

## Dokumentasjon
Dokumentasjon finnes i [Confluence](https://confluence.adeo.no/display/TA/Meldekort). Dokumentasjonen gjelder for den
gamle JBoss/Wicket-applikasjonen, men vil bli oppdatert forløpende under utviklingen av denne nye versjonen.

## Tekster
Denne appen har en mekanisme for tekstversjonering. Dvs. appen viser de versjonenne av tekstene som var gyldige i
begynnelsen av meldeperioden til aktivt meldekort. Hvis meldekort ikke er valgt, viser appen de nyeste versjonene av
tekstene.

Tekstene er lagret i en DB og derfor må vi gå gjennom meldekort-api og meldekortservice for å nå dem.

For å endre tekstene (eller opprette nye versjoner) må man endre fil R__recreate_texts.sql i meldekortservice og deploye
meldekortservice på nytt.
Dette gir mulighet å teste endringer i DEV/QA først og hindrer direkte endringer i prod DB.

OBS! Meldekort-frontend har også cache for tekstene (30 minutter), dvs. appen skal ikke prøve å hente tekstene med samme
språk og gyldighetstid på nytt i løpet av 30 minutter.

## Henvendelser
Spørsmål knyttet til koden eller prosjekt rettes mot:

* Geir Skjeret, geir.skjeret@nav.no
* Igor Shuliakov, igor.shuliakov@nav.no

## For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #team-arbeid / #meldekort

## For utviklere
OBS! Man bør ha minst npm versjon 7 siden package-lock.json er på lockfileVersion 2 nå.

### Start applikasjonen lokalt
1. Last ned npm-pakker med `npm install`.
2. Kjør `npm start`. Appen starter da på [http://localhost:3000](http://localhost:3000).
3. Hvis man vil kjøre appen i mock-modus (uten meldekort-api kjørende lokalt) starter man appen med `npm run start:mock`

For de som utvikler på tynnklienten, må disse to linjer med kode settes øverst i .npmrc-filen før npm install fungerer.
* `proxy=http://155.55.60.117:8088/`
* `https-proxy=http://155.55.60.117:8088/`

### Andre tilgjengelige kommandoer
* `npm test` kjører testene.
* `npm run build` bygger appen for produksjon.
