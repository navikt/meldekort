import { Meldekort } from './meldekort';

// fetchMeldekort
export interface Person {
  maalformkode: string;
  meldeform: MeldeForm;
  meldekort: Meldekort[];
  etterregistrerteMeldekort: Meldekort[];
  fravaer: Fravaer[];
  id: string;
  antallGjenstaaendeFeriedager: number;
}

export interface PersonInfo {
  personId: number;
  fodselsnr: string;
  etternavn: string;
  fornavn: string;
}

// hentPersonstatus
export interface PersonStatus {
  id: string;
  statusArbeidsoker: string;
  statusYtelse: string;
}

export interface MeldeformDetaljerInn {
  meldeformNavn: string;
}

export interface Meldeperiode {
  id: string;
  meldeperiodeNavn: string;
  fraDato: Date;
  tilDato: Date;
}

export enum MeldeForm {
  ELEKTRONISK = 'EMELD',
  PAPIR = 'PAPIR',
  MANUELL = 'MANU',
  AUTO = 'AUTO',
  IKKE_SATT = 'IKKE SATT',
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
  ARBEIDS_FRAVAER = 'F',
}
