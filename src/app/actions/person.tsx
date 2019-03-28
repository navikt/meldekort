import { AxiosError } from 'axios';
import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';
import { MeldeForm, Person } from '../types/person';

export enum PersonTypeKeys {
    HENT_PERSON = 'HENT_PERSON',
    HENT_PERSON_OK = 'HENT_PERSON_OK',
    HENT_PERSON_FEILET = 'HENT_PERSON_FEILET',
    ENDRE_MELDEFORM = 'ENDRE_MELDEFORM',
}

export const PersonActions = {
    hentPerson: createAsyncAction(
        PersonTypeKeys.HENT_PERSON,
        PersonTypeKeys.HENT_PERSON_OK,
        PersonTypeKeys.HENT_PERSON_FEILET
    )<void, Person, AxiosError>(),

    endreMeldeform: createStandardAction(PersonTypeKeys.ENDRE_MELDEFORM)<MeldeForm>(),
};

export type PersonActionTypes = ActionType<typeof PersonActions>;