import { Sporsmal as Spm } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../sider/innsending/utfyllingsside/utfylling/utfyllingConfig';
import { Meldekortdetaljer, MeldekortdetaljerInnsending, ValideringsResultat } from './meldekort';

export interface InnsendingState {
    meldekortId: number;
    korrigertMeldekortId: number;
    innsendingstype: Innsendingstyper | null;
    sporsmalsobjekter: Spm[];
    utfylteDager: UtfyltDag[];
    meldekortdetaljer: Meldekortdetaljer;
    meldekortdetaljerInnsending?: MeldekortdetaljerInnsending | null;
    valideringsResultat?: ValideringsResultat | undefined;
}

export interface FeilIDager {
    feil: boolean;
    feilmelding?: string;
    feilIDager?: string[];
}

export interface SpmSvar {
    kategori: string;
    svar: boolean;
}

export enum Innsendingstyper {
    innsending = 'innsending',
    etterregistrering = 'etterregistrering',
    korrigering = 'korriger',
}

export enum InnsendingTypeKeys {
    HENT_KORRIGERTID = 'HENT_KORRIGERTID',
    HENT_KORRIGERTID_FEILET = 'HENT_KORRIGERTID_FEILET',
    HENT_KORRIGERTID_OK = 'HENT_KORRIGERTID_OK',

    LEGG_TIL_INNSENDINGSTYPE = 'LEGG_TIL_INNSENDINGSTYPE',
    LEGG_TIL_MELDEKORTID = 'LEGG_TIL_MELDEKORTID',

    OPPDATER_DAGER = 'OPPDATER_DAGER',
    OPPDATER_MELDEKORTDETALJER = 'OPPDATER_MELDEKORTDETALJER',
    OPPDATER_SPM = 'OPPDATER_SPM',

    SETT_MELDEKORTDETALJER_INNSENDING = 'SETT_MELDEKORTDETALJER_INNSENDING',
    SETT_VALIDERINGSRESULTAT = 'SETT_VALIDERINGSRESULTAT',

    RESET_INNSENDING = 'RESET_INNSENDING',
    RESET_SPORSMAL_OG_UTFYLLING = 'RESET_SPORSMAL_OG_UTFYLLING',

    KONTROLLER_MELDEKORT = 'KONTROLLER_MELDEKORT',
    KONTROLLER_MELDEKORT_OK = 'KONTROLLER_MELDEKORT_OK',
    KONTROLLER_MELDEKORT_FEILET = 'KONTROLLER_MELDEKORT_FEILET'

}