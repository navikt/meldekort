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
    feilIDager?: {
        mandag1?: string;
        tirsdag1?: string;
        onsdag1?: string;
        torsdag1?: string;
        fredag1?: string;
        lordag1?: string;
        sondag1?: string;
        mandag2?: string;
        tirsdag2?: string;
        onsdag2?: string;
        torsdag2?: string;
        fredag2?: string;
        lordag2?: string;
        sondag2?: string;
    };
}