import { ActionType, createAsyncAction } from 'typesafe-actions';
import { PersonStatus } from '../types/person';
import { AxiosError } from 'axios';

export enum PersonStatusTypeKeys {
  HENT_PERSON_STATUS = 'HENT_PERSON_STATUS',
  HENT_PERSON_STATUS_OK = 'HENT_PERSON_STATUS_OK',
  HENT_PERSON_STATUS_FEILET = 'HENT_PERSON_STATUS_FEILET',
}

export const PersonStatusActions = {
  hentPersonStatus: createAsyncAction(
    PersonStatusTypeKeys.HENT_PERSON_STATUS,
    PersonStatusTypeKeys.HENT_PERSON_STATUS_OK,
    PersonStatusTypeKeys.HENT_PERSON_STATUS_FEILET
  )<void, PersonStatus, AxiosError>(),
};

export type PersonStatusActionTypes = ActionType<typeof PersonStatusActions>;
