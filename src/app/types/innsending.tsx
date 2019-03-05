import { KortStatus, Sporsmal } from './meldekort';
import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';

export enum Constants {
    LEGG_TIL_SVAR = 'LEGG_TIL_SVAR',
    SETT_MELDEKORTINFO = "SETT_MELDEKORTINTO",
    OPPDATER_SPM = "OPPDATER_SPM",
}

export interface InnsendingState {
    meldekortId: number;
    sporsmalsobjekter: Spm[];
    kortStatus: KortStatus;
}