import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';

export enum Constants {
    OPPDATER_SPM = "OPPDATER_SPM",
}

export interface InnsendingState {
    sporsmalsobjekter: Spm[];
}