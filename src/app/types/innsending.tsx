import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';

export enum Constants {
    OPPDATER_SPM = 'OPPDATER_SPM',
    OPPDATER_DAGER = 'OPPDATER_DAGER'
}

export interface InnsendingState {
    sporsmalsobjekter: Spm[];
    utfylteDager: UtfyltDag[];
}

export interface FeilIDager {
    feil: boolean;
    feilmelding?: string;
    feilIDager?: string[];
}