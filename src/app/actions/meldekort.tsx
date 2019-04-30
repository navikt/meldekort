import { ActionType, createStandardAction } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { SendtMeldekort } from '../types/meldekort';

export enum MeldekortTypeKeys {
    API_KALL_FEILET = 'API_KALL_FEILET',
    LEGG_TIL_INNSENDT_MELDEKORT = 'LEGG_TIL_INNSENDT_MELDEKORT'
}

export const MeldekortActions = {
    apiKallFeilet: createStandardAction(MeldekortTypeKeys.API_KALL_FEILET)<AxiosError>(),
    leggTilInnsendtMeldekort: createStandardAction(MeldekortTypeKeys.LEGG_TIL_INNSENDT_MELDEKORT)<SendtMeldekort[]>()
};

export type MeldekortActionTypes = ActionType<typeof MeldekortActions>;