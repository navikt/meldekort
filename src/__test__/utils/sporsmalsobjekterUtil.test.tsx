import { opprettSporsmalsobjekter } from '../../app/api/sporsmalsobjekterUtil';
import { RootState } from '../../app/store/configureStore';
import {
  KortStatus,
  KortType,
  Meldegruppe,
  Meldekort,
  MeldekortDag,
  MeldekortState,
  Sporsmalsobjekt,
} from '../../app/types/meldekort';
import { InnsendingState, Innsendingstyper } from '../../app/types/innsending';
import { hentSporsmalConfig } from '../../app/sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { hentUtfyltDagConfig } from '../../app/sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig';
import {
  formaterDato,
  hentDatoForAndreUke,
  hentDatoForForsteUke,
  hentNestePeriodeMedUkerOgDato,
  hentTid,
  hentUkenummerForDato,
  ukeTekst,
} from '../../app/utils/dates';
import { hentIntl } from '../../app/utils/intlUtil';
import { hentDagliste } from '../../app/components/meldekortdetaljer/ukevisning/dagliste';
import { renderToStaticMarkup } from 'react-dom/server';
import { testPerson } from '../testSetup/testData';

const MELDEKORT_ID = 1234567;
const FRA = new Date('2019-12-30T10:00:00Z');
const TIL = new Date('2020-01-12T10:00:00Z');
const KAN_SENDES_FRA = new Date('2020-01-13T10:00:00Z');
const MOTTATT_DATO = new Date();
const MELDE_DATO = new Date();
const LEST_DATO = new Date();

const aktivtMeldekort: Meldekort = {
  meldekortId: MELDEKORT_ID,
  kortType: KortType.ELEKTRONISK,
  meldeperiode: {
    til: TIL,
    fra: FRA,
    kanKortSendes: true,
    kortKanSendesFra: KAN_SENDES_FRA,
    periodeKode: '201901',
  },
  meldegruppe: Meldegruppe.DAGP,
  kortStatus: KortStatus.OPPRE,
  mottattDato: new Date(MOTTATT_DATO),
  korrigerbart: true,
};

const nesteMeldekort: Meldekort = {
  meldekortId: MELDEKORT_ID + 1,
  kortType: KortType.ELEKTRONISK,
  meldeperiode: {
    til: TIL,
    fra: FRA,
    kanKortSendes: true,
    kortKanSendesFra: KAN_SENDES_FRA,
    periodeKode: '201903',
  },
  meldegruppe: Meldegruppe.DAGP,
  kortStatus: KortStatus.OPPRE,
  mottattDato: new Date(MOTTATT_DATO),
  korrigerbart: true,
};

const meldekortDager: MeldekortDag[] = [
  {
    dag: 1,
    arbeidetTimerSum: 7.5,
    syk: false,
    annetFravaer: false,
    kurs: false,
  },
];

const innsending: InnsendingState = {
  meldekortId: MELDEKORT_ID,
  korrigertMeldekortId: 0,
  innsendingstype: Innsendingstyper.INNSENDING,
  begrunnelse: {
    valgtArsak: '',
    valgtArsakTekst: '',
    erFeil: false,
  },
  sporsmalsobjekter: hentSporsmalConfig(),
  utfylteDager: hentUtfyltDagConfig(),
  meldekortdetaljer: {
    id: '',
    meldekortId: MELDEKORT_ID,
    meldeperiode: '',
    arkivnokkel: '',
    kortType: KortType.KORRIGERT_ELEKTRONISK,
    meldeDato: new Date(MELDE_DATO),
    lestDato: new Date(LEST_DATO),
    sporsmal: {
      annetFravaer: false,
      arbeidet: false,
      arbeidssoker: false,
      syk: false,
      kurs: false,
      signatur: false,
      meldekortDager: meldekortDager,
    },
    begrunnelse: '',
  },
  meldekortdetaljerInnsending: {
    meldekortId: MELDEKORT_ID,
    kortType: KortType.ELEKTRONISK,
    kortStatus: KortStatus.OPPRE,
    meldegruppe: Meldegruppe.DAGP,
    mottattDato: new Date(MOTTATT_DATO),
    meldeperiode: {
      til: TIL,
      fra: FRA,
      kanKortSendes: true,
      kortKanSendesFra: KAN_SENDES_FRA,
      periodeKode: '201901',
    },
    erArbeidssokerNestePeriode: false,
    fravaersdager: [],
    korrigerbart: true,
    begrunnelse: '',
    signatur: true,
    sesjonsId: 'bla',
    sporsmalsobjekter: [],
  },
  valideringsResultat: undefined,
};

const meldekort: MeldekortState = {
  sendteMeldekort: [],
  infomelding: {
    norsk: '',
    engelsk: '',
  },
};

const state: RootState = {
  // @ts-ignore
  locales: null,
  // @ts-ignore
  intl: null,
  // @ts-ignore
  router: null,
  person: testPerson,
  // @ts-ignore
  personStatus: null,
  // @ts-ignore
  personInfo: null,
  // @ts-ignore
  meldekortdetaljer: null,
  aktivtMeldekort: aktivtMeldekort,
  // @ts-ignore
  historiskeMeldekort: null,
  innsending: innsending,
  // @ts-ignore
  meny: null,
  // @ts-ignore
  ui: null,
  meldekort: meldekort,
  // @ts-ignore
  weblogic: null,
};

// aktivtMeldekort, innsending, person, meldekort

it('opprettSporsmalsobjekter for meldekort uten neste meldekort', () => {
  const result = opprettSporsmalsobjekter(state);
  checkResult(result);

  expect(result[0].advarsel).toBe(undefined);
  expect(result[0].forklaring).toBe(undefined);
  expect(result[0].sporsmal).toBe('');
  expect(result[0].svar).toBe(
    hentIntl().formatMessage(
      { id: 'sendt.mottatt.pdfheader' },
      {
        type: hentIntl()
          .formatMessage({ id: 'overskrift.meldekort' })
          .trim(),
        period: 'Uke 1 - 2 (30.12.2019 - 12.01.2020)',
        mottatt: formaterDato(MOTTATT_DATO) + ' ' + hentTid(MOTTATT_DATO),
        kortKanSendesFra: '',
      }
    )
  );
});

it('opprettSporsmalsobjekter for meldekort med neste meldekort', () => {
  const newState = { ...state };
  newState.person.meldekort.push(nesteMeldekort);

  const result = opprettSporsmalsobjekter(newState);
  checkResult(result);

  expect(result[0].advarsel).toBe(undefined);
  expect(result[0].forklaring).toBe(undefined);
  expect(result[0].sporsmal).toBe('');
  expect(result[0].svar).toBe(
    hentIntl().formatMessage(
      { id: 'sendt.mottatt.pdfheader' },
      {
        type: hentIntl()
          .formatMessage({ id: 'overskrift.meldekort' })
          .trim(),
        period: 'Uke 1 - 2 (30.12.2019 - 12.01.2020)',
        mottatt: formaterDato(MOTTATT_DATO) + ' ' + hentTid(MOTTATT_DATO),
        kortKanSendesFra:
          hentIntl().formatMessage(
            { id: 'sendt.mottatt.meldekortKanSendes' },
            {
              0: formaterDato(KAN_SENDES_FRA),
            }
          ) + '<br/>',
      }
    )
  );
});

it('opprettSporsmalsobjekter for korrigert meldekort med neste meldekort', () => {
  const arsak = '1';
  const arsakTekst = 'Bla bla bla';

  const newState = { ...state };
  newState.innsending.innsendingstype = Innsendingstyper.KORRIGERING;
  newState.innsending.begrunnelse = {
    valgtArsak: arsak,
    valgtArsakTekst: arsakTekst,
    erFeil: false,
  };

  const result = opprettSporsmalsobjekter(newState);
  checkResult(result, 1);

  expect(result[0].advarsel).toBe(undefined);
  expect(result[0].forklaring).toBe(undefined);
  expect(result[0].sporsmal).toBe('');
  expect(result[0].svar).toBe(
    hentIntl().formatMessage(
      { id: 'sendt.mottatt.pdfheader' },
      {
        type: hentIntl()
          .formatMessage({ id: 'meldekort.type.korrigert' })
          .trim(),
        period: 'Uke 1 - 2 (30.12.2019 - 12.01.2020)',
        mottatt: formaterDato(MOTTATT_DATO) + ' ' + hentTid(MOTTATT_DATO),
        kortKanSendesFra: '',
      }
    )
  );

  expect(result[3].advarsel).toBe(undefined);
  expect(result[3].forklaring).toBe(
    hentIntl().formatMessage({
      id: 'forklaring.sporsmal.begrunnelse',
    })
  );
  expect(result[3].sporsmal).toBe(
    hentIntl().formatMessage({
      id: 'korrigering.sporsmal.begrunnelse',
    })
  );
  expect(result[3].svar).toBe(arsak);
});

const checkResult = (result: Sporsmalsobjekt[], add: number = 0) => {
  expect(result.length).toBe(15 + add);

  expect(result[1].advarsel).toBe(undefined);
  expect(result[1].forklaring).toBe(undefined);
  expect(result[1].sporsmal).toBe(
    hentIntl().formatMessage({
      id: 'sporsmal.lesVeiledning',
    })
  );
  expect(result[1].svar).toBe(undefined);

  expect(result[2].advarsel).toBe(undefined);
  expect(result[2].forklaring).toBe(undefined);
  expect(result[2].sporsmal).toBe(
    hentIntl().formatMessage({
      id: 'sporsmal.ansvarForRiktigUtfylling',
    })
  );
  expect(result[2].svar).toBe(undefined);

  expect(result[3 + add].advarsel).toBe(undefined);
  expect(result[3 + add].forklaring).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[0].forklaring,
    })
  );
  expect(result[3 + add].sporsmal).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[0].sporsmal,
    })
  );
  expect(result[3 + add].svar).toBe(
    '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[0].ja }) +
      '<br>' +
      '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[0].nei })
  );

  expect(result[4 + add].advarsel).toBe(undefined);
  expect(result[4 + add].forklaring).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[1].forklaring,
    })
  );
  expect(result[4 + add].sporsmal).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[1].sporsmal,
    })
  );
  expect(result[4 + add].svar).toBe(
    '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[1].ja }) +
      '<br>' +
      '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[1].nei })
  );

  expect(result[5 + add].advarsel).toBe(undefined);
  expect(result[5 + add].forklaring).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[2].forklaring,
    })
  );
  expect(result[5 + add].sporsmal).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[2].sporsmal,
    })
  );
  expect(result[5 + add].svar).toBe(
    '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[2].ja }) +
      '<br>' +
      '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[2].nei })
  );

  expect(result[6 + add].advarsel).toBe(undefined);
  expect(result[6 + add].forklaring).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[3].forklaring,
    })
  );
  expect(result[6 + add].sporsmal).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[3].sporsmal,
    })
  );
  expect(result[6 + add].svar).toBe(
    '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[3].ja }) +
      '<br>' +
      '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[3].nei })
  );

  expect(result[7 + add].advarsel).toBe(undefined);
  expect(result[7 + add].forklaring).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[4].forklaring,
    })
  );
  expect(result[7 + add].sporsmal).toBe(
    hentIntl().formatMessage({
      id: innsending.sporsmalsobjekter[4].sporsmal,
    }) + hentNestePeriodeMedUkerOgDato(FRA, TIL)
  );
  expect(result[7 + add].svar).toBe(
    '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[4].ja }) +
      '<br>' +
      '_ ' +
      hentIntl().formatMessage({ id: innsending.sporsmalsobjekter[4].nei })
  );

  expect(result[8 + add].advarsel).toBe(undefined);
  expect(result[8 + add].forklaring).toBe(undefined);
  expect(result[8 + add].sporsmal).toBe(
    ukeTekst() +
      hentUkenummerForDato(FRA) +
      ' (' +
      hentDatoForForsteUke(FRA) +
      ')'
  );
  expect(result[8 + add].svar).toBe(
    hentDagliste(meldekortDager, '', false)
      .map(element => renderToStaticMarkup(element))
      .join('')
  );

  expect(result[9 + add].advarsel).toBe(undefined);
  expect(result[9 + add].forklaring).toBe(undefined);
  expect(result[9 + add].sporsmal).toBe(
    ukeTekst() +
      hentUkenummerForDato(TIL) +
      ' (' +
      hentDatoForAndreUke(TIL) +
      ')'
  );
  expect(result[9 + add].svar).toBe('');

  expect(result[10 + add].advarsel).toBe(
    hentIntl().formatMessage({ id: 'sendt.advarsel' })
  );
  expect(result[10 + add].forklaring).toBe(
    '<b>' +
      hentIntl().formatMessage({
        id: 'utfylling.arbeid',
      }) +
      '</b><br/>' +
      hentIntl().formatMessage({
        id: 'forklaring.utfylling.arbeid',
      })
  );
  expect(result[10 + add].sporsmal).toBe('');
  expect(result[10 + add].svar).toBe(undefined);

  expect(result[11 + add].advarsel).toBe('');
  expect(result[11 + add].forklaring).toBe(
    '<b>' +
      hentIntl().formatMessage({
        id: 'utfylling.tiltak',
      }) +
      '</b><br/>' +
      hentIntl().formatMessage({
        id: 'forklaring.utfylling.tiltak',
      })
  );
  expect(result[11 + add].sporsmal).toBe('');
  expect(result[11 + add].svar).toBe(undefined);

  expect(result[12 + add].advarsel).toBe('');
  expect(result[12 + add].forklaring).toBe(
    '<b>' +
      hentIntl().formatMessage({
        id: 'utfylling.syk',
      }) +
      '</b><br/>' +
      hentIntl().formatMessage({
        id: 'forklaring.utfylling.syk',
      })
  );
  expect(result[12 + add].sporsmal).toBe('');
  expect(result[12 + add].svar).toBe(undefined);

  expect(result[13 + add].advarsel).toBe('');
  expect(result[13 + add].forklaring).toBe(
    '<b>' +
      hentIntl().formatMessage({
        id: 'utfylling.ferieFravar',
      }) +
      '</b><br/>' +
      hentIntl().formatMessage({
        id: 'forklaring.utfylling.ferieFravar',
      })
  );
  expect(result[13 + add].sporsmal).toBe('');
  expect(result[13 + add].svar).toBe(undefined);

  expect(result[14 + add].advarsel).toBe(undefined);
  expect(result[14 + add].forklaring).toBe(undefined);
  expect(result[14 + add].sporsmal).toBe(
    hentIntl().formatMessage({
      id: 'utfylling.bekreft',
    }) +
      '<br><br>X ' +
      hentIntl().formatMessage({
        id: 'utfylling.bekreftAnsvar',
      })
  );
  expect(result[14 + add].svar).toBe(undefined);

  console.log(result);
};
