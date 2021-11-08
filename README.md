# Meldekort
Meldekort er et webgrensesnitt for brukere å sende inn utfylte meldekort-skjema til NAV.
Meldekort tilbyr påloggende arbeidssøkere å se sin meldekorthistorikk samt å fylle ut og sende inn meldekort.

## Dokumentasjon
Dokumentasjon finnes i [Confluence](https://confluence.adeo.no/display/TMP/Meldekort-api). Dokumentasjonen gjelder for den
gamle JBoss/Wicket-applikasjonen, men vil bli oppdatert forløpende under utviklingen av denne nye versjonen.
Om Meldekort journalføring: https://confluence.adeo.no/pages/viewpage.action?pageId=431009242

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

## Endre tekster
Ved endring av tekster, husk å bygge/kompilere tekstene ved å kjøre kommandoen `npm run build:tekster`

### Andre tilgjengelige kommandoer

* `npm test` kjører testene.

* `npm run build` bygger appen for produksjon.
