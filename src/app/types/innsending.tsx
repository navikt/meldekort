import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { KortStatus } from './meldekort';

export enum Constants {
    OPPDATER_SPM = "OPPDATER_SPM",
    LEGG_TIL_MELDEKORTID = "LEGG_TIL_MELDEKORTID",
}

export interface InnsendingState {
    meldekortId: number;
    kortStatus: KortStatus;
    sporsmalsobjekter: Spm[];
}