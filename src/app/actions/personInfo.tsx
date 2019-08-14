import { ActionType, createAsyncAction } from 'typesafe-actions';
import { PersonInfo } from '../types/person';
import { AxiosError } from 'axios';

export enum PersonInfoTypeKeys {
  HENT_PERSON_INFO = 'HENT_PERSON_INFO',
  HENT_PERSON_INFO_OK = 'HENT_PERSON_INFO_OK',
  HENT_PERSON_INFO_FEILET = 'HENT_PERSON_INFO_FEILET',
}

export const PersonInfoActions = {
  hentPersonInfo: createAsyncAction(
    PersonInfoTypeKeys.HENT_PERSON_INFO,
    PersonInfoTypeKeys.HENT_PERSON_INFO_OK,
    PersonInfoTypeKeys.HENT_PERSON_INFO_FEILET
  )<void, PersonInfo, AxiosError>(),
};

export type PersonInfoActionTypes = ActionType<typeof PersonInfoActions>;
