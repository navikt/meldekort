# Meldekort
Meldekort er et webgrensesnitt for brukere å sende inn utfylte meldekort-skjema til NAV.
Meldekort tilbyr påloggende arbeidssøkere å se sin meldekorthistorikk samt å fylle ut og sende inn meldekort.

## Dokumentasjon
Dokumentasjon finnes i [Confluence](https://confluence.adeo.no/display/TA/Meldekort). Dokumentasjonen gjelder for den 
gamle JBoss/Wicket-applikasjonen, men vil bli oppdatert forløpende under utviklingen av denne nye versjonen.

## Henvendelser
Spørsmål knyttet til koden eller prosjekt rettes mot:

* My Thao Nguyen, my.thao.nguyen@nav.no
* Yrjan Fraschetti, yrjan.fraschetti@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-arbeid / #meldekort

## For utviklere

### Start applikasjonen lokalt

1. Last ned npm-pakker med `npm install`.

2. Kjør `npm start`. Appen starter da på [http://localhost:3000](http://localhost:3000).


For de som utvikler på tynnklienten, må disse to linjer med kode settes øverst i .npmrc-filen før npm install fungerer.
* `proxy=http://155.55.60.117:8088/` 
* `https-proxy=http://155.55.60.117:8088/`


### Andre tilgjengelige kommandoer

* `npm test` kjører testene.

* `npm run build` bygger appen for produksjon.
