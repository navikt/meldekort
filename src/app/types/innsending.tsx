import { Sporsmal as Spm } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { KortStatus } from './meldekort';

export enum InnsendingTypeKeys {
    HENT_KORRIGERTID = 'HENT_KORRIGERTID',
    HENT_KORRIGERTID_OK = 'HENT_KORRIGERTID_OK',
    HENT_KORRIGERTID_FEILET = 'HENT_KORRIGERTID_FEILET',
    OPPDATER_SPM = 'OPPDATER_SPM',
    LEGG_TIL_MELDEKORTID = 'LEGG_TIL_MELDEKORTID',
    LEGG_TIL_INNSENDINGSTYPE = 'LEGG_TIL_INNSENDINGSTYPE',
    RESET_INNSENDING = 'RESET_INNSENDING'
}

export interface InnsendingState {
    meldekortId: number;
    innsendingstype: Innsendingstyper | null,
    sporsmalsobjekter: Spm[];
}

export enum Innsendingstyper {
    innsending = 'innsending',
    etterregistrering = 'etterregistrering',
    korrigering = 'korriger',
}