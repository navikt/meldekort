import { MenyPunkt } from "../../app/utils/menyConfig";
import SendMeldekort from "../../app/sider/sendMeldekort/sendMeldekort";
import TidligereMeldekort from "../../app/sider/tidligereMeldekort/tidligereMeldekort";
import { KortStatus, KortType, Meldegruppe, Meldekort, MeldekortDag, Meldeperiode } from "../../app/types/meldekort";
import { Feilmelding, InnsendingState, UtfyllingFeil } from "../../app/types/innsending";
import { hentSporsmalConfig } from "../../app/sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig";
import { hentUtfyltDagConfig } from "../../app/sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig";
import { MeldeForm, Person, PersonInfo } from "../../app/types/person";

export const menyPunkterTEST: MenyPunkt[] = [
  {
    exact: true,
    component: SendMeldekort,
    tittel: "sendMeldekort",
    tekstid: "naviger.send",
    urlparam: "/send-meldekort",
    disabled: false,
  },
  {
    component: TidligereMeldekort,
    tekstid: "sekundarmeny.tidligere",
    tittel: "tidligereMeldekort",
    urlparam: "/tidligere-meldekort",
    disabled: false,
  },
];

export const mkDagTEST: MeldekortDag = {
  dag: 1,
  arbeidetTimerSum: 7.5,
  syk: false,
  annetFravaer: true,
  kurs: false
};

const dateString = "2019-01-01T10:00:00Z";

export const mkDetaljerTEST = {
  id: "",
  meldekortId: 0,
  meldeperiode: "",
  arkivnokkel: "",
  kortType: KortType.KORRIGERT_ELEKTRONISK,
  meldeDato: new Date(dateString),
  lestDato: new Date(dateString),
  sporsmal: {
    annetFravaer: false,
    arbeidet: false,
    arbeidssoker: false,
    syk: false,
    kurs: false,
    signatur: false,
    meldekortDager: [],
  },
  begrunnelse: ""
};

export const sporsmalOgSvarTest = [
  {
    kategori: "arbeid",
    sporsmal: "sporsmal.arbeid",
    forklaring: "forklaring.sporsmal.arbeid",
    svar: true,
    formatertDato: "20.01.2019",
  },
  {
    kategori: "aktivitetArbeid",
    sporsmal: "sporsmal.aktivitetArbeid",
    forklaring: "forklaring.sporsmal.aktivitetArbeid",
    svar: false,
    formatertDato: "20.01.2019",
  },
];

const meldeperiodeTEST: Meldeperiode = {
  til: new Date(dateString),
  fra: new Date(dateString),
  kanKortSendes: true,
  kortKanSendesFra: new Date(dateString),
  periodeKode: "201901"
};

export const mkTEST: Meldekort = {
  meldekortId: 1,
  kortType: KortType.ELEKTRONISK,
  meldeperiode: meldeperiodeTEST,
  meldegruppe: Meldegruppe.DAGP,
  kortStatus: KortStatus.OPPRE,
  bruttoBelop: 0,
  mottattDato: new Date(dateString),
  korrigerbart: true
};

export const mkDagerTEST: MeldekortDag[] = [
  {
    dag: 1,
    arbeidetTimerSum: 7.5,
    syk: false,
    annetFravaer: true,
    kurs: false,
  },
];

const feilmelding: Feilmelding = {
  feil: true,
  feilmelding: "Test"
};

export const utfyllingFeilTEST: UtfyllingFeil = {
  feilIArbeid: feilmelding,
  feilIKurs: feilmelding,
  feilISyk: feilmelding,
  feilIFerie: feilmelding,
  feilKombinasjonSykArbeid: false,
  feilKombinasjonFravaerArbeid: false,
  feilKombinasjonFravaerSyk: false,
  feilIArbeidetTimerHeleHalve: true,
  feilIArbeidetTimer: true,
  feilIDagerHorisontal: [{ uke: 1, dag: 1, rad: "A" }],
  feilIDagerVertikal: [{ uke: 1, dag: 2, rad: "S" }]
};

export const innsendingTEST: InnsendingState = {
  meldekortId: 0,
  korrigertMeldekortId: 0,
  innsendingstype: null,
  begrunnelse: {
    valgtArsak: "",
    valgtArsakTekst: "",
    erFeil: false,
  },
  sporsmalsobjekter: hentSporsmalConfig(),
  utfylteDager: hentUtfyltDagConfig(),
  meldekortdetaljer: {
    id: "",
    meldekortId: 0,
    meldeperiode: "",
    arkivnokkel: "",
    kortType: KortType.KORRIGERT_ELEKTRONISK,
    meldeDato: new Date(dateString),
    lestDato: new Date(dateString),
    sporsmal: {
      annetFravaer: false,
      arbeidet: false,
      arbeidssoker: false,
      syk: false,
      kurs: false,
      signatur: false,
      meldekortDager: [],
    },
    begrunnelse: "",
  },
  meldekortdetaljerInnsending: undefined,
  valideringsResultat: undefined
};

export const testPerson: Person = {
  maalformkode: "",
  meldeform: MeldeForm.IKKE_SATT,
  meldekort: [mkTEST],
  etterregistrerteMeldekort: [],
  fravaer: [],
  id: "",
  antallGjenstaaendeFeriedager: 0
};

export const testPersoninfo: PersonInfo = {
  personId: 123456,
  fodselsnr: "01020312345",
  etternavn: "Test",
  fornavn: "Testesen"
};
