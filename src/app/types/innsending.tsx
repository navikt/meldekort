import { Sporsmal } from './meldekort';

export enum Constants {
    LEGG_TIL_SVAR = 'LEGG_TIL_SVAR',
    SETT_MELDEKORTID = "SETT_MELDEKORTID",
}

export interface Innsending {
    meldekortId: number;
    sporsmal: Sporsmal;
    // Sett inn vars for utfylling.
}