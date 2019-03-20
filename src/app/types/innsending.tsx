import { Sporsmal as Spm } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../sider/innsending/utfyllingsside/utfylling/utfyllingConfig';

export enum InnsendingTypeKeys {
    HENT_KORRIGERTID = 'HENT_KORRIGERTID',
    HENT_KORRIGERTID_FEILET = 'HENT_KORRIGERTID_FEILET',
    HENT_KORRIGERTID_OK = 'HENT_KORRIGERTID_OK',
    LEGG_TIL_INNSENDINGSTYPE = 'LEGG_TIL_INNSENDINGSTYPE',
    LEGG_TIL_MELDEKORTID = 'LEGG_TIL_MELDEKORTID',
    OPPDATER_DAGER = 'OPPDATER_DAGER',
    OPPDATER_SPM = 'OPPDATER_SPM',
    RESET_INNSENDING = 'RESET_INNSENDING',
}

export interface InnsendingState {
    meldekortId: number;
    korrigertMeldekortId: number;
    innsendingstype: Innsendingstyper | null,
    sporsmalsobjekter: Spm[];
    utfylteDager: UtfyltDag[];
}

export interface FeilIDager {
    feil: boolean;
    feilmelding?: string;
    feilIDager?: string[];
}

export enum Innsendingstyper {
    innsending = 'innsending',
    etterregistrering = 'etterregistrering',
    korrigering = 'korriger',
}