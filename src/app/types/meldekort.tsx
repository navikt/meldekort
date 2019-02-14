// Defining the redux state and constants
import * as actions from '../actions/meldekort';
import { ActionType } from 'typesafe-actions';

// import { DemoActions } when you need to use our actions
export type MeldekortActions = ActionType<typeof actions>;

// CONSTANTS / Action?
export enum Constants {
    LEGG_TIL_MELDEKORT = 'LEGG_TIL_MELDEKORT'
}

export interface Meldekort {
    meldekortId: bigint;
    kortType: KortType;
    meldeperiode: Meldeperiode;
    meldegruppe: Meldegruppe;
    kortStatus: KortStatus;
    bruttoBelop: bigint;
    erForskuddsPeriode: boolean;
    mottattDato: Date;
    korrigerbart: boolean;
}

export interface HistoriskeMeldekort {
    historiskeMeldekort: Meldekort[];
}

// hentMeldekortDetaljer
export interface Meldekortdetaljer {
    id: string;
    personId: number;
    fodselsnr: string;
    meldekortId: number;
    meldeperiode: string;
    arkivnokkel: string;
    kortType: string;
    meldeDato: Date;
    lestDato: Date;
    sporsmal: [];
    begrunnelse: string;
}

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

export interface Meldeperiode {
    fra: Date;
    til: Date;
    kortKanSendesFra: Date;
    periodeKode: string;
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
    OPPRE,
    SENDT,
    SLETT,
    REGIS,
    FMOPP,
    FUOPP,
    KLAR,
    KAND,
    IKKE,
    OVERM,
    NYKTR,
    FERDI,
    FEIL,
    VENTE,
    OPPF
}
