import { ActionType, createAsyncAction } from 'typesafe-actions';
import { WeblogicPing } from '../types/weblogic';
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
  )<void, WeblogicPing, AxiosError>(),
};

export type WeblogicActionTypes = ActionType<typeof WeblogicActions>;
