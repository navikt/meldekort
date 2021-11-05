import Environment from '../utils/env';
import { Konstanter } from '../utils/consts';
import { erMock } from '../mock/utils';
import { Person, PersonInfo, PersonStatus } from '../types/person';
import { prefferedAxios } from '../types/fetch';
import {
  Infomelding,
  Meldekort,
  MeldekortDag,
  Meldekortdetaljer,
  MeldekortdetaljerInnsending,
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
  hentTid,
  hentUkenummerForDato,
  ukeTekst,
} from '../utils/dates';
import {
  Begrunnelse,
  InnsendingState,
  Innsendingstyper,
} from '../types/innsending';
import {
  meldekortSomKanSendes,
  nesteMeldekortKanSendes,
  returnerMeldekortListaMedFlereMeldekortIgjen,
} from '../utils/meldekortUtils';
import { hentDagliste } from '../components/meldekortdetaljer/ukevisning/dagliste';
import { renderToStaticMarkup } from 'react-dom/server';

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
  const { aktivtMeldekort, innsending, person } = state;
  const {
    innsendingstype,
    meldekortdetaljerInnsending,
    begrunnelse,
  } = innsending;
  const typeYtelsePostfix = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

  let { til, fra } = aktivtMeldekort.meldeperiode;
  let korrigering = innsendingstype === Innsendingstyper.KORRIGERING;

  // Vi må finne neste meldekort først
  let nesteAktivtMeldekort;
  const sendteMeldekort = state.meldekort.sendteMeldekort;
  sendteMeldekort.push(aktivtMeldekort);
  const meldekort = meldekortSomKanSendes(person.meldekort, sendteMeldekort);
  const etterregistrerteMeldekort = meldekortSomKanSendes(
    person.etterregistrerteMeldekort,
    sendteMeldekort
  );
  const harBrukerFlereMeldekort = meldekort.length > 0;
  const harBrukerFlereEtterregistrerteMeldekort =
    etterregistrerteMeldekort.length > 0;
  const paramsForMeldekort = returnerMeldekortListaMedFlereMeldekortIgjen(
    meldekort,
    Innsendingstyper.INNSENDING,
    etterregistrerteMeldekort,
    Innsendingstyper.ETTERREGISTRERING
  );
  const paramsForEtterregistrerte = returnerMeldekortListaMedFlereMeldekortIgjen(
    etterregistrerteMeldekort,
    Innsendingstyper.ETTERREGISTRERING,
    meldekort,
    Innsendingstyper.INNSENDING
  );

  if (innsendingstype === Innsendingstyper.INNSENDING) {
    if (harBrukerFlereMeldekort) {
      nesteAktivtMeldekort = paramsForMeldekort.nesteAktivtMeldekort;
    } else if (harBrukerFlereEtterregistrerteMeldekort) {
      nesteAktivtMeldekort = paramsForEtterregistrerte.nesteAktivtMeldekort;
    }
  } else if (innsendingstype === Innsendingstyper.ETTERREGISTRERING) {
    if (harBrukerFlereEtterregistrerteMeldekort) {
      nesteAktivtMeldekort = paramsForEtterregistrerte.nesteAktivtMeldekort;
    } else if (harBrukerFlereMeldekort) {
      nesteAktivtMeldekort = paramsForMeldekort.nesteAktivtMeldekort;
    }
  }

  // Nå kan vi finne ut når neste meldekort kan sendes inn
  const nesteDato = nesteMeldekortKanSendes(
    nesteAktivtMeldekort,
    innsendingstype,
    person
  );

  const meldekortdager = innsending.meldekortdetaljer.sporsmal.meldekortDager;

  // Oppretter et object for å samle alt vi trenger
  let sporsmalsobjekter: Sporsmalsobjekt[] = new Array<Sporsmalsobjekt>();

  sporsmalsobjekter.push(
    header(korrigering, meldekortdetaljerInnsending, nesteDato)
  );
  sporsmalsobjekter.push(veiledning());
  sporsmalsobjekter.push(ansvar());

  if (korrigering) {
    sporsmalsobjekter.push(
      korrigeringsBegrunnelse(begrunnelse, typeYtelsePostfix)
    );
  }

  sporsmalsobjekter.push(...sporsmal(innsending, fra, til));

  sporsmalsobjekter.push(uke1(fra, meldekortdager, typeYtelsePostfix));
  sporsmalsobjekter.push(uke2(til, meldekortdager, typeYtelsePostfix));

  sporsmalsobjekter.push(utfyllingArbeid(typeYtelsePostfix));
  sporsmalsobjekter.push(utfyllingTiltak(typeYtelsePostfix));
  sporsmalsobjekter.push(utfyllingSyk(typeYtelsePostfix));
  sporsmalsobjekter.push(utfyllingFerieFravar(typeYtelsePostfix));

  sporsmalsobjekter.push(bekreftelse(typeYtelsePostfix));

  console.log(sporsmalsobjekter);
  return sporsmalsobjekter;
}

function header(
  korrigering: boolean,
  meldekortdetaljerInnsending: MeldekortdetaljerInnsending | undefined,
  nesteDato: Date | null
): Sporsmalsobjekt {
  const meldekortMottatt =
    formaterDato(meldekortdetaljerInnsending!.mottattDato) +
    ' ' +
    hentTid(meldekortdetaljerInnsending!.mottattDato);

  // Vi vet ikke meldekort ID før vi sender det, vi kan ikke stole på klokkeslett fra JS, vi må mappe tema
  // Men vi må ha denne teksten på riktig språk
  // Derfor setter vi nn alt vi kan og sender teksten videre med placeholders (f.eks %TEMA%)
  // Disse senere erstattes i meldekort-api
  return {
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
          meldekortdetaljerInnsending!.meldeperiode.fra,
          meldekortdetaljerInnsending!.meldeperiode.til
        ),
        mottatt: meldekortMottatt,
        kortKanSendesFra: nesteDato
          ? hentIntl().formatMessage(
              { id: 'sendt.meldekortKanSendes' },
              {
                0: formaterDato(nesteDato),
              }
            ) + '<br/>'
          : '',
      }
    ),
  };
}

function veiledning(): Sporsmalsobjekt {
  return {
    sporsmal: hentIntl().formatMessage({
      id: 'sporsmal.lesVeiledning',
    }),
  };
}

function ansvar(): Sporsmalsobjekt {
  return {
    sporsmal: hentIntl().formatMessage({
      id: 'sporsmal.ansvarForRiktigUtfylling',
    }),
  };
}

function korrigeringsBegrunnelse(
  begrunnelse: Begrunnelse,
  typeYtelsePostfix: String
): Sporsmalsobjekt {
  return {
    sporsmal: hentIntl().formatMessage({
      id: 'korrigering.sporsmal.begrunnelse',
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.sporsmal.begrunnelse' + typeYtelsePostfix,
    }),
    svar: begrunnelse.valgtArsak,
  };
}

function sporsmal(
  innsending: InnsendingState,
  fra: Date,
  til: Date
): Sporsmalsobjekt[] {
  return innsending.sporsmalsobjekter.map(spm => {
    let formatertDato =
      spm.kategori === 'registrert'
        ? hentNestePeriodeMedUkerOgDato(fra, til)
        : '';

    return {
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
    };
  });
}

function uke1(
  fra: Date,
  meldekortdager: MeldekortDag[],
  typeYtelsePostfix: string
): Sporsmalsobjekt {
  return {
    sporsmal:
      ukeTekst() +
      hentUkenummerForDato(fra) +
      ' (' +
      hentDatoForForsteUke(fra) +
      ')',
    svar: hentDagliste(meldekortdager.slice(0, 7), typeYtelsePostfix, false)
      .map(element => renderToStaticMarkup(element))
      .join(''),
  };
}

function uke2(
  til: Date,
  meldekortdager: MeldekortDag[],
  typeYtelsePostfix: string
): Sporsmalsobjekt {
  return {
    sporsmal:
      ukeTekst() +
      hentUkenummerForDato(til) +
      ' (' +
      hentDatoForAndreUke(til) +
      ')',
    svar: hentDagliste(meldekortdager.slice(7, 14), typeYtelsePostfix, false)
      .map(element => renderToStaticMarkup(element))
      .join(''),
  };
}

function utfyllingArbeid(typeYtelsePostfix: String): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.arbeid',
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.arbeid' + typeYtelsePostfix,
    }),
  };
}

function utfyllingTiltak(typeYtelsePostfix: String): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.tiltak',
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.tiltak' + typeYtelsePostfix,
    }),
  };
}

function utfyllingSyk(typeYtelsePostfix: String): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.syk',
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.syk' + typeYtelsePostfix,
    }),
  };
}

function utfyllingFerieFravar(typeYtelsePostfix: String): Sporsmalsobjekt {
  return {
    advarsel:
      'Du har sannsynligvis ikke sett informasjonen nedenfor dersom du har svart NEI på det relaterte spørsmålet',
    sporsmal: hentIntl().formatMessage({
      id: 'utfylling.ferieFravar',
    }),
    forklaring: hentIntl().formatMessage({
      id: 'forklaring.utfylling.ferieFravar' + typeYtelsePostfix,
    }),
  };
}

function bekreftelse(typeYtelsePostfix: String): Sporsmalsobjekt {
  return {
    sporsmal:
      hentIntl().formatMessage({
        id: 'utfylling.bekreft' + typeYtelsePostfix,
      }) +
      '<br><br>X ' +
      hentIntl().formatMessage({
        id: 'utfylling.bekreftAnsvar',
      }),
  };
}
