import { InnsendingState, Innsendingstyper, InnsendingTypeKeys } from '../types/innsending';
import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';
import { Sporsmal as Spm } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { AxiosError } from 'axios';
import { UtfyltDag } from '../sider/innsending/utfyllingsside/utfylling/utfyllingConfig';

export const InnsendingActions = {
    hentKorrigertId: createAsyncAction(
        InnsendingTypeKeys.HENT_KORRIGERTID,
        InnsendingTypeKeys.HENT_KORRIGERTID_OK,
        InnsendingTypeKeys.HENT_KORRIGERTID_FEILET
    )<void, number, AxiosError>(),

    oppdaterUtfylteDager: createStandardAction(InnsendingTypeKeys.OPPDATER_DAGER)<UtfyltDag[]>(),
    oppdaterSpm: createStandardAction(InnsendingTypeKeys.OPPDATER_SPM)<Spm[]>(),
    leggTilMeldekortId: createStandardAction(InnsendingTypeKeys.LEGG_TIL_MELDEKORTID) <number>(),
    leggTilInnsendingstype: createStandardAction(InnsendingTypeKeys.LEGG_TIL_INNSENDINGSTYPE)<Innsendingstyper | null>(),
    resetInnsending: createStandardAction(InnsendingTypeKeys.RESET_INNSENDING)<void>(),
};

export type InnsendingActionsTypes = ActionType<typeof InnsendingActions>;