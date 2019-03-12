import { Constants, InnsendingState, Innsendingstyper } from '../types/innsending';
import { action, ActionType, createAsyncAction } from 'typesafe-actions';
import { Sporsmal as Spm } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { AxiosError } from 'axios';

export enum KorrigertIdTypeKeys {
    HENT_KORRIGERTID = 'HENT_KORRIGERTID',
    HENT_KORRIGERTID_OK = 'HENT_KORRIGERTID_OK',
    HENT_KORRIGERTID_FEILET = 'HENT_KORRIGERTID_FEILET',
}

export const KorrigertIdActions = {
    hentKorrigertId: createAsyncAction(
        KorrigertIdTypeKeys.HENT_KORRIGERTID,
        KorrigertIdTypeKeys.HENT_KORRIGERTID_OK,
        KorrigertIdTypeKeys.HENT_KORRIGERTID_FEILET
    )<void, InnsendingState, AxiosError>(),
};

export function oppdaterSpm(sporsmalsobjekter: Spm[]) {
    return action (Constants.OPPDATER_SPM, {sporsmalsobjekter})
}
export function leggTilMeldekortId(meldekortId: number) {
    return action (Constants.LEGG_TIL_MELDEKORTID, {meldekortId})
}
export function leggTilInnsendingstype(innsendingstype: Innsendingstyper) {
    return action (Constants.LEGG_TIL_INNSENDINGSTYPE, {innsendingstype})
}

export type InnsendingActions = ActionType<typeof oppdaterSpm> &
    ActionType<typeof leggTilMeldekortId>&
    ActionType<typeof leggTilInnsendingstype> &
    ActionType<typeof KorrigertIdActions>;