import { Meldekort } from './meldekort';

// Denne får man tilbake ved kall til hentMeldekort
export interface Person {
    personId: number;
    etternavn: string;
    fornavn: string;
    maalformkode: string;
    meldeform: string;
    meldekort: Meldekort[];
    etterregistrerteMeldekort: [];
    fravaer: [];
    id: string;
    antallGjenstaaendeFeriedager: number;
}

// Denne får man tilbake ved kall til hentPersonstatus
export interface PersonStatus {
    id: string;
    statusArbeidsoker: string;
    statusYtelse: string;
}