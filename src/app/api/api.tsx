import Environment from '../utils/env';
import { Konstanter } from '../utils/consts';
import { erMock } from '../mock/utils';
import { Person, PersonInfo, PersonStatus } from '../types/person';
import { prefferedAxios } from '../types/fetch';
import {
  Infomelding,
  Meldekort,
  Meldekortdetaljer,
  Sporsmalsobjekt,
  ValideringsResultat,
} from '../types/meldekort';
import { WeblogicPing } from '../types/weblogic';
import { RootState } from '../store/configureStore';
import { finnTypeYtelsePostfix } from '../utils/teksterUtil';
import * as React from 'react';
import { hentIntl } from '../utils/intlUtil';
import {
  hentDatoForAndreUke,
  hentDatoForForsteUke,
  hentNestePeriodeMedUkerOgDato,
  hentUkenummerForDato,
  ukeTekst,
} from '../utils/dates';

const fetchGet = async (url: string) => {
  return prefferedAxios
    .get(Environment().apiUrl + url, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    })
    .then(response => {
      return response.data;
    });
};

const fetchPost = async (url: string, data: any) => {
  return prefferedAxios
    .post(Environment().apiUrl + url, data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    })
    .then(response => {
      return response.data;
    });
};

export const fetchMeldekort = (): Promise<Person> => {
  return fetchGet(Konstanter().hentMeldekortApiUri);
};

export function fetchHistoriskeMeldekort(): Promise<Meldekort[]> {
  return fetchGet(Konstanter().hentHistoriskeMeldekortApiUri);
}

export function fetchMeldekortdetaljer(id: number): Promise<Meldekortdetaljer> {
  return fetchGet(
    addIdToUrlIfNotMock(Konstanter().hentMeldekortdetaljerApiUri, id)
  );
}

export function fetchPersonstatus(): Promise<PersonStatus> {
  return fetchGet(Konstanter().hentPersonStatusApiUri);
}

export function fetchPersoninfo(): Promise<PersonInfo> {
  return fetchGet(Konstanter().hentPersonInfoApiUri);
}

export function fetchKorrigertId(id: number): Promise<number> {
  return fetchGet(
    addIdToUrlIfNotMock(Konstanter().hentKorrigertMeldekortIdApiUri, id)
  );
}

export function fetchInfomelding(): Promise<Infomelding> {
  return fetchGet(Konstanter().hentInfomelding);
}

export function pingWeblogic(): Promise<WeblogicPing> {
  return fetchGet(Konstanter().pingWeblogic);
}

export function postMeldekort(state: RootState): Promise<ValideringsResultat> {
  let meldekortdetaljer = {
    ...state.innsending.meldekortdetaljerInnsending!,
    sporsmalsobjekter: opprettSporsmalsobjekter(state),
  };

  return fetchPost(Konstanter().sendMeldekortApiUri, meldekortdetaljer);
}

function addIdToUrlIfNotMock(url: string, id: number): string {
  if (!erMock()) {
    return url.replace('{id}', id.toString());
  }
  return url;
}

function opprettSporsmalsobjekter(state: RootState): Sporsmalsobjekt[] {
  const typeYtelsePostfix = finnTypeYtelsePostfix(
    state.aktivtMeldekort.meldegruppe
  );

  let { til, fra } = state.aktivtMeldekort.meldeperiode;

  // Side 1
  let sporsmalsobjekter: Sporsmalsobjekt[] = state.innsending.sporsmalsobjekter.map(
    spm => {
      let formatertDato =
        spm.kategori === 'registrert'
          ? hentNestePeriodeMedUkerOgDato(fra, til)
          : '';

      return {
        sporsmal:
          hentIntl().formatMessage({ id: spm.sporsmal + typeYtelsePostfix }) +
          formatertDato,
        forklaring: hentIntl().formatMessage({
          id: spm.forklaring + typeYtelsePostfix,
        }),
        svar:
          (spm.checked?.endsWith('ja') ? 'X ' : '_ ') +
          hentIntl().formatMessage({ id: spm.ja + typeYtelsePostfix }) +
          '<br>' +
          (spm.checked?.endsWith('nei') ? 'X ' : '_ ') +
          hentIntl().formatMessage({ id: spm.nei + typeYtelsePostfix }),
      };
    }
  );

  // Side 2
  let uke1: Sporsmalsobjekt = {
    sporsmal:
      ukeTekst() +
      hentUkenummerForDato(fra) +
      ' (' +
      hentDatoForForsteUke(fra) +
      ')',
  };

  let uke2: Sporsmalsobjekt = {
    sporsmal:
      ukeTekst() +
      hentUkenummerForDato(til) +
      ' (' +
      hentDatoForAndreUke(til) +
      ')',
  };

  sporsmalsobjekter.push(uke1);
  sporsmalsobjekter.push(arbeidsdager(state, typeYtelsePostfix, 1));
  sporsmalsobjekter.push(tiltaksdager(state, typeYtelsePostfix, 1));
  sporsmalsobjekter.push(sykedager(state, typeYtelsePostfix, 1));
  sporsmalsobjekter.push(feriedager(state, typeYtelsePostfix, 1));

  sporsmalsobjekter.push(uke2);
  sporsmalsobjekter.push(arbeidsdager(state, typeYtelsePostfix, 2));
  sporsmalsobjekter.push(tiltaksdager(state, typeYtelsePostfix, 2));
  sporsmalsobjekter.push(sykedager(state, typeYtelsePostfix, 2));
  sporsmalsobjekter.push(feriedager(state, typeYtelsePostfix, 2));

  return sporsmalsobjekter;
}

function ukedager() {
  return (
    hentIntl()
      .formatMessage({ id: 'ukedag.mandag' })
      .toUpperCase()[0] +
    ' ' +
    hentIntl()
      .formatMessage({ id: 'ukedag.tirsdag' })
      .toUpperCase()[0] +
    ' ' +
    hentIntl()
      .formatMessage({ id: 'ukedag.onsdag' })
      .toUpperCase()[0] +
    ' ' +
    hentIntl()
      .formatMessage({ id: 'ukedag.torsdag' })
      .toUpperCase()[0] +
    ' ' +
    hentIntl()
      .formatMessage({ id: 'ukedag.fredag' })
      .toUpperCase()[0] +
    ' ' +
    hentIntl()
      .formatMessage({ id: 'ukedag.lordag' })
      .toUpperCase()[0] +
    ' ' +
    hentIntl()
      .formatMessage({ id: 'ukedag.sondag' })
      .toUpperCase()[0]
  );
}

function arbeidsdager(
  state: RootState,
  typeYtelsePostfix: String,
  uke: number
): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.arbeid' + typeYtelsePostfix,
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.arbeid' + typeYtelsePostfix,
    }),
    svar:
      ukedager() +
      '<br>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.arbeidetTimer) {
            return dag.arbeidetTimer;
          } else {
            return 0;
          }
        })
        .join(','),
  };
}

function tiltaksdager(
  state: RootState,
  typeYtelsePostfix: String,
  uke: number
): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.tiltak' + typeYtelsePostfix,
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.tiltak' + typeYtelsePostfix,
    }),
    svar:
      ukedager() +
      '<br>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.kurs) {
            return 'X';
          } else {
            return '_';
          }
        })
        .join(', '),
  };
}

function sykedager(
  state: RootState,
  typeYtelsePostfix: String,
  uke: number
): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.syk' + typeYtelsePostfix,
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.syk' + typeYtelsePostfix,
    }),
    svar:
      ukedager() +
      '<br>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.syk) {
            return 'X';
          } else {
            return '_';
          }
        })
        .join(', '),
  };
}

function feriedager(
  state: RootState,
  typeYtelsePostfix: String,
  uke: number
): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.ferieFravar' + typeYtelsePostfix,
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.ferieFravar' + typeYtelsePostfix,
    }),
    svar:
      ukedager() +
      '<br>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.annetFravaer) {
            return 'X';
          } else {
            return '_';
          }
        })
        .join(', '),
  };
}
