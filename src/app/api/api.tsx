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
  formaterDato,
  formaterUkeOgDatoPeriode,
  hentDatoForAndreUke,
  hentDatoForForsteUke,
  hentNestePeriodeMedUkerOgDato,
  hentUkenummerForDato,
  ukeTekst,
} from '../utils/dates';
import { Innsendingstyper } from '../types/innsending';

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
  const { aktivtMeldekort, innsending } = state;

  const typeYtelsePostfix = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

  let { til, fra, kortKanSendesFra } = aktivtMeldekort.meldeperiode;
  let korrigering = innsending.innsendingstype === Innsendingstyper.KORRIGERING;

  let sporsmalsobjekter: Sporsmalsobjekt[] = new Array<Sporsmalsobjekt>();

  // Vi vet ikke meldekort ID før vi sender det, vi kan ikke stole på klokkeslett fra JS, vi må mappe tema
  // Men vi må ha denne teksten på riktig språk
  // Derfor setter vi nn alt vi kan og sender teksten videre med placeholders (f.eks %TEMA%)
  // Disse senere erstattes i meldekort-api
  sporsmalsobjekter.push({
    sporsmal: '',
    svar: hentIntl().formatMessage(
      { id: 'sendt.mottatt.pdfheader' },
      {
        type: korrigering
          ? hentIntl()
              .formatMessage({ id: 'meldekort.type.korrigert' })
              .trim() + ' '
          : '',
        period: formaterUkeOgDatoPeriode(
          innsending.meldekortdetaljerInnsending!.meldeperiode.fra,
          innsending.meldekortdetaljerInnsending!.meldeperiode.til
        ),
        kortKanSendesFra: formaterDato(kortKanSendesFra),
      }
    ),
  });

  sporsmalsobjekter.push({
    sporsmal: hentIntl().formatMessage({
      id: 'sporsmal.lesVeiledning' + typeYtelsePostfix,
    }),
  });

  if (korrigering) {
    sporsmalsobjekter.push({
      sporsmal: hentIntl().formatMessage({
        id: 'korrigering.sporsmal.begrunnelse' + typeYtelsePostfix,
      }),
      forklaring: hentIntl().formatMessage({
        id: 'forklaring.sporsmal.begrunnelse' + typeYtelsePostfix,
      }),
      svar: innsending.begrunnelse.valgtArsak,
    });
  }

  // Side 1
  innsending.sporsmalsobjekter.forEach(spm => {
    let formatertDato =
      spm.kategori === 'registrert'
        ? hentNestePeriodeMedUkerOgDato(fra, til)
        : '';

    sporsmalsobjekter.push({
      sporsmal: hentIntl().formatMessage({ id: spm.sporsmal }) + formatertDato,
      forklaring: hentIntl().formatMessage({
        id: spm.forklaring,
      }),
      svar:
        (spm.checked?.endsWith('ja') ? 'X ' : '_ ') +
        hentIntl().formatMessage({ id: spm.ja }) +
        '<br>' +
        (spm.checked?.endsWith('nei') ? 'X ' : '_ ') +
        hentIntl().formatMessage({ id: spm.nei }),
    });
  });

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

  sporsmalsobjekter.push({
    sporsmal:
      hentIntl().formatMessage({
        id: 'utfylling.bekreft' + typeYtelsePostfix,
      }) +
      '<br><br>X ' +
      hentIntl().formatMessage({
        id: 'utfylling.bekreftAnsvar' + typeYtelsePostfix,
      }),
  });

  console.log(sporsmalsobjekter);
  return sporsmalsobjekter;
}

function ukedager() {
  return (
    '<td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.mandag' })
      .toUpperCase()[0] +
    '</td><td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.tirsdag' })
      .toUpperCase()[0] +
    '</td><td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.onsdag' })
      .toUpperCase()[0] +
    '</td><td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.torsdag' })
      .toUpperCase()[0] +
    '</td><td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.fredag' })
      .toUpperCase()[0] +
    '</td><td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.lordag' })
      .toUpperCase()[0] +
    '</td><td>' +
    hentIntl()
      .formatMessage({ id: 'ukedag.sondag' })
      .toUpperCase()[0] +
    '</td>'
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
      '<table border="1" style="border-collapse:collapse"><tr>' +
      ukedager() +
      '</tr><tr><td>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.arbeidetTimer) {
            return dag.arbeidetTimer;
          } else {
            return 0;
          }
        })
        .join('</td><td>') +
      '</td></tr></table>',
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
      '<table border="1" style="border-collapse:collapse"><tr>' +
      ukedager() +
      '</tr><tr><td>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.kurs) {
            return 'X';
          } else {
            return '_';
          }
        })
        .join('</td><td>') +
      '</td></tr></table>',
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
      '<table border="1" style="border-collapse:collapse"><tr>' +
      ukedager() +
      '</tr><tr><td>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.syk) {
            return 'X';
          } else {
            return '_';
          }
        })
        .join('</td><td>') +
      '</td></tr></table>',
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
      '<table border="1" style="border-collapse:collapse"><tr>' +
      ukedager() +
      '</tr><tr><td>' +
      state.innsending.utfylteDager
        .filter(dag => dag.uke == uke)
        .map(dag => {
          if (dag.annetFravaer) {
            return 'X';
          } else {
            return '_';
          }
        })
        .join('</td><td>') +
      '</td></tr></table>',
  };
}
