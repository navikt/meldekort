// CONSTANTS / Action?
// Defining the redux state and constants
import * as actions from '../actions/meldekort';
import { ActionType } from 'typesafe-actions';

// import { DemoActions } when you need to use our actions
export type MeldekortDemoActions = ActionType<typeof actions>;

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
    bruttoBelop?: number;
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

    fnr: string;
    personId: number;
    ipAdresse: string;
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
