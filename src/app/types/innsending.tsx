import { KortStatus, Sporsmal } from './meldekort';

export enum Constants {
    LEGG_TIL_SVAR = 'LEGG_TIL_SVAR',
    SETT_MELDEKORTINFO = "SETT_MELDEKORTINTO",
}

export interface Innsending {
    meldekortId: number;
    kortStatus: KortStatus;
    sporsmal: Sporsmal;
    // Sett inn vars for utfylling.
}