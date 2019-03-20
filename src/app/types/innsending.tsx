import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';
import { Meldekortdetaljer, MeldekortdetaljerInnsending, ValideringsResultat } from './meldekort';

export enum Constants {
    OPPDATER_SPM = 'OPPDATER_SPM',
    OPPDATER_DAGER = 'OPPDATER_DAGER',
    OPPDATER_MELDEKORTDETALJER = 'OPPDATER_MELDEKORTDETALJER',
    SETT_MELDEKORTDETALJER_INNSEDNING = 'SET_MELDEKORTDETALJER_INNSEDNING',
    SETT_VALIDERINGSRESULTAT = 'SETT_VALIDERINGSRESULTAT',

    KONTROLLER_MELDEKORT = 'KONTROLLER_MELDEKORT',
    KONTROLLER_MELDEKORT_OK = 'KONTROLLER_MELDEKORT_OK',
    KONTROLLER_MELDEKORT_FEILET = 'KONTROLLER_MELDEKORT_FEILET'

}

export interface InnsendingState {
    sporsmalsobjekter: Spm[];
    utfylteDager: UtfyltDag[];
    meldekortdetaljer: Meldekortdetaljer;
    meldekortdetaljerInnsending?: MeldekortdetaljerInnsending;
    valideringsResultat?: ValideringsResultat;
}

export interface FeilIDager {
    feil: boolean;
    feilmelding?: string;
    feilIDager?: string[];
}