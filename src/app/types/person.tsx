import { Meldekort } from './meldekort';

// fetchMeldekort
export interface Person {
    personId: number;
    fodselsnr: string;
    etternavn: string;
    fornavn: string;
    maalformkode: string;
    meldeform: MeldeForm;
    meldekort: Meldekort[];
    etterregistrerteMeldekort: Meldekort[];
    fravaer: Fravaer[];
    id: string;
    antallGjenstaaendeFeriedager: number;
}

// hentPersonstatus
export interface PersonStatus {
    id: string;
    statusArbeidsoker: string;
    statusYtelse: string;
}

export enum MeldeForm {
    ELEKTRONISK = 'EMELD',
    PAPIR = 'PAPIR',
    MANUELL = 'MANU',
    AUTO = 'AUTO',
    IKKE_SATT = 'IKKE SATT'
}

export interface Fravaer {
    fraDato: Date;
    tilDato: Date;
    type: FravaerType;
}

export enum FravaerType {
    KURS_UTDANNING = 'K',
    SYKDOM = 'S',
    ANNET_FRAVAER = 'X',
    ARBEIDS_FRAVAER = 'F'
}
