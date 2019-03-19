import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';
import { Meldekortdetaljer } from './meldekort';

export enum Constants {
    OPPDATER_SPM = 'OPPDATER_SPM',
    OPPDATER_DAGER = 'OPPDATER_DAGER',
    OPPDATER_MELDEKORTDETALJER = 'OPPDATER_MELDEKORTDETALJER'
}

export interface InnsendingState {
    sporsmalsobjekter: Spm[];
    utfylteDager: UtfyltDag[];
    meldekortdetaljer: Meldekortdetaljer;
}

export interface FeilIDager {
    feil: boolean;
    feilmelding?: string;
    feilIDager?: string[];
}