import { ActionType, createAsyncAction } from 'typesafe-actions';
import { Skrivemodus } from '../types/skrivemodus';
import { AxiosError } from 'axios';

export enum WeblogicTypeKeys {
  PING_WEBLOGIC = 'PING_WEBLOGIC',
  PING_WEBLOGIC_OK = 'PING_WEBLOGIC_OK',
  PING_WEBLOGIC_FEILET = 'PING_WEBLOGIC_FEILET',
}

export const WeblogicActions = {
  pingWeblogic: createAsyncAction(
    WeblogicTypeKeys.PING_WEBLOGIC,
    WeblogicTypeKeys.PING_WEBLOGIC_OK,
    WeblogicTypeKeys.PING_WEBLOGIC_FEILET
  )<void, Skrivemodus, AxiosError>(),
};

export type WeblogicActionTypes = ActionType<typeof WeblogicActions>;
