import { AxiosError } from 'axios';
import { ActionType, createAsyncAction } from 'typesafe-actions';
import { Meldekort } from '../types/meldekort';

export enum HistoriskeMeldekortTypeKeys {
    HENT_HISTORISKE = 'HENT_HISTORISKE',
    HENT_HISTORISKE_OK = 'HENT_HISTORISKE_OK',
    HENT_HISTORISKE_FEILET = 'HENT_HISTORISKE_FEILET',
}

export const HistoriskeMeldekortActions = {
    hentHistoriskeMeldekort: createAsyncAction(
        HistoriskeMeldekortTypeKeys.HENT_HISTORISKE,
        HistoriskeMeldekortTypeKeys.HENT_HISTORISKE_OK,
        HistoriskeMeldekortTypeKeys.HENT_HISTORISKE_FEILET,
    )<void, Meldekort[], AxiosError>(),
};

export type HistoriskeMeldekortActionTypes = ActionType<typeof HistoriskeMeldekortActions>;