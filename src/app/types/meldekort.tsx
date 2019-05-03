/* INTERFACES */

export interface Meldekort {
    meldekortId: number;
    kortType: KortType;
    meldeperiode: Meldeperiode;
    meldegruppe: Meldegruppe;
    kortStatus: KortStatus;
    bruttoBelop?: number;
    mottattDato: Date;
    korrigerbart: boolean;
}

export interface SendteMeldekortState {
    sendteMeldekort: SendtMeldekort[];
}

export interface SendtMeldekort {
    meldekortId: number;
    kortType: KortType;
}

// hentMeldekortDetaljer
export interface Meldekortdetaljer {
    id: string;
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
    kanKortSendes: boolean;
    periodeKode: string;
}

export interface MeldekortdetaljerInnsending {
    meldekortId: number;
    kortType: KortType;
    kortStatus: KortStatus;
    meldegruppe: Meldegruppe;
    mottattDato: Date;
    meldeperiode: Meldeperiode;
    erArbeidssokerNestePeriode: boolean;
    bruttoBelop?: number;
    fravaersdager: Fravaer[];
    korrigerbart: boolean;
    begrunnelse: string;
    signatur: boolean;

    sesjonsId: string;
}

export interface Fravaer {
    dag: Date;
    type: FravaerType;
    arbeidTimer?: number;
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
    meldegruppe?: string;
}

export interface FravaerType {
    typeFravaer: FravaerTypeEnum;
}

export interface HistoriskeMeldekortRad {
    meldekort: Meldekort;
    periode?: string;
    dato: string;
    mottatt: string;
    status: string;
    bruttobelop: string;
    detaljer?: string;
}

export interface DetaljRad {
    meldekortid: number;
    kortType: string;
    kortStatus: string;
    bruttoBelop: string;
    mottattDato: any;
}

/* ENUMS */

export enum KortType {
    ORDINAER = 'ORDINAER',
    ERSTATNING = 'ERSTATNING',
    RETUR = 'RETUR',
    ELEKTRONISK = 'ELEKTRONISK',
    AAP = 'AAP',
    ORDINAER_MANUELL = 'ORDINAER_MANUELL',
    MASKINELT_OPPDATERT = 'MASKINELT_OPPDATERT',
    MANUELL_ARENA = 'MANUELL_ARENA',
    KORRIGERT_ELEKTRONISK = 'KORRIGERT_ELEKTRONISK'
}

export enum Meldegruppe {
    ATTF = 'ATTF',
    DAGP = 'DAGP',
    INDIV = 'INDIV',
    ARBS = 'ARBS',
    FY = 'FY',
    NULL = 'NULL'
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

export enum FravaerTypeEnum {
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
    forklaring: string;
}
