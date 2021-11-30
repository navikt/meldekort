import { RootState } from '../store/configureStore';
import {
  MeldekortDag,
  MeldekortdetaljerInnsending,
  Sporsmalsobjekt,
} from '../types/meldekort';
import { finnTypeYtelsePostfix } from '../utils/teksterUtil';
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
import { hentIntl } from '../utils/intlUtil';
import { hentDagliste } from '../components/meldekortdetaljer/ukevisning/dagliste';
import { renderToStaticMarkup } from 'react-dom/server';

export function opprettSporsmalsobjekter(state: RootState): Sporsmalsobjekt[] {
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
  const sendteMeldekort = Array.of(...state.meldekort.sendteMeldekort);
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

  sporsmalsobjekter.push(
    utfylling('utfylling.arbeid', typeYtelsePostfix, true)
  );
  sporsmalsobjekter.push(utfylling('utfylling.tiltak', typeYtelsePostfix));
  sporsmalsobjekter.push(utfylling('utfylling.syk', typeYtelsePostfix));
  sporsmalsobjekter.push(utfylling('utfylling.ferieFravar', typeYtelsePostfix));

  sporsmalsobjekter.push(bekreftelse(typeYtelsePostfix));

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
  // Derfor setter vi alt vi kan og sender teksten videre med placeholders (f.eks %TEMA%)
  // Disse senere erstattes i meldekort-api
  return {
    sporsmal: '',
    svar: hentIntl().formatMessage(
      { id: 'sendt.mottatt.pdfheader' },
      {
        type: korrigering
          ? hentIntl()
              .formatMessage({ id: 'meldekort.type.korrigert' })
              .trim()
          : hentIntl()
              .formatMessage({ id: 'overskrift.meldekort' })
              .trim(),
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

function utfylling(
  id: string,
  typeYtelsePostfix: string,
  medAdvarsel: boolean = false
): Sporsmalsobjekt {
  return {
    advarsel: medAdvarsel
      ? hentIntl().formatMessage({ id: 'sendt.advarsel' })
      : '',
    sporsmal: '',
    forklaring:
      '<b>' +
      hentIntl().formatMessage({
        id: id,
      }) +
      '</b><br/>' +
      hentIntl().formatMessage({
        id: 'forklaring.' + id + typeYtelsePostfix,
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
