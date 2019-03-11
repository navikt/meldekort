import { Sporsmal as Spm } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { KortStatus } from './meldekort';

export enum Constants {
    OPPDATER_SPM = "OPPDATER_SPM",
    LEGG_TIL_MELDEKORTID = "LEGG_TIL_MELDEKORTID",
    LEGG_TIL_INNSENDINGSTYPE = "LEGG_TIL_INNSENDINGSTYPE",
}

export interface InnsendingState {
    meldekortId: number;
    kortStatus: KortStatus;
    innsendingstype: Innsendingstyper,
    sporsmalsobjekter: Spm[];
}

export enum Innsendingstyper {
    innsending = 'innsending',
    korrigering = 'korrigering',
}