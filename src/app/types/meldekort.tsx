// CONSTANTS / Action?
export enum Constants {
    LEGG_TIL_AKTIVT_MELDEKORT = 'LEGG_TIL_AKTIVT_MELDEKORT'
}

/* INTERFACES */
export interface Meldekort {
    meldekortId: number;
    kortType: KortType;
    meldeperiode: Meldeperiode;
    meldegruppe: Meldegruppe;
    kortStatus: KortStatus;
    bruttoBelop: number;
    mottattDato: Date;
    korrigerbart: boolean;
}

// hentMeldekortDetaljer
export interface Meldekortdetaljer {
    id: string;
    personId: number;
    fodselsnr: string;
    meldekortId: number;
    meldeperiode: string;
    arkivnokkel: string;
    kortType: KortType;
    meldeDato: Date;
    lestDato: Date;
    sporsmal: Sporsmal;
    begrunnelse: string;
}

export interface Meldeperiode {
    fra: Date;
    til: Date;
    kortKanSendesFra: Date;
    periodeKode: string;
}

export interface MeldekortdetaljerInnsending {
    meldekortId: number;
    kortType: KortType;
    meldegruppe: Meldegruppe;
    mottattDato: Date;
    meldeperiode: Meldeperiode;
    erArbeidssokerNestePeriode: boolean;
    bruttoBelop: number;
    fravaersdager: Fravaer[];
    korrigerbart: boolean;
    begrunnelse: string;

    fnr: string;
    personId: number;
    ipAdresse: string;
    sessjonsId: string;
}

export interface Fravaer {
    dag: Date;
    type: FravaerType;
    arbeidTimer: number;
}

export interface ValideringsResultat {
    meldekortId: number;
    status: string;
    arsakskoder: Arsakskode[];
    meldekortdager: MeldekortDag[];
}

export interface Arsakskode {
    kode: string;
    tekst: string;
}

export interface Sporsmal {
    arbeidssoker: boolean;
    arbeidet: boolean;
    syk: boolean;
    annetFravaer: boolean;
    kurs: boolean;
    signatur: boolean;
    meldekortDager: MeldekortDag[];
}

export interface MeldekortDag {
    dag: number;
    arbeidetTimerSum: number;
    syk: boolean;
    annetFravaer: boolean;
    kurs: boolean;
    meldegruppe: string;
}

/* ENUMS */
export enum KortType {
    ORDINAER = '01',
    ERSTATNING = '03',
    RETUR = '04',
    ELEKTRONISK = '05',
    AAP = '06',
    ORDINAER_MANUELL = '07',
    MASKINELT_OPPDATERT = '08',
    MANUELL_ARENA = '09',
    KORRIGERT_ELEKTRONISK = '10'
}

export enum Meldegruppe {
    ATTF,
    DAGP,
    INDIV,
    ARBS,
    FY,
    NULL
}

export enum KortStatus {
    OPPRE = 'OPPRE',
    SENDT = 'SENDT',
    SLETT = 'SLETT',
    REGIS = 'REGIS' ,
    FMOPP = 'FMOPP',
    FUOPP = 'FUOPP',
    KLAR = 'KLAR',
    KAND = 'KAND',
    IKKE = 'IKKE',
    OVERM = 'OVERM',
    NYKTR = 'NYKTR',
    FERDI = 'FERDI',
    FEIL = 'FEIL',
    VENTE = 'VENTE',
    OPPF = 'OPPF'
}

export enum FravaerType {
    KURS_UTDANNING = 'K',
    SYKDOM = 'S',
    ANNET_FRAVAER = 'X',
    ARBEIDS_FRAVAER = 'A'
}

// Internt bruk

export interface SporsmalOgSvar {
    sporsmalId: string;
    svar: boolean;
    formatertDato?: string;
}
