import { ActionType, createStandardAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

export enum MeldekortTypeKeys {
    API_KALL_FEILET = 'API_KALL_FEILET'
}

export const MeldekortActions = {
    apiKallFeilet: createStandardAction(MeldekortTypeKeys.API_KALL_FEILET)<AxiosError>()
};

export type MeldekortActionTypes = ActionType<typeof MeldekortActions>;