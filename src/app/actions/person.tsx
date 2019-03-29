import { AxiosError } from 'axios';
import { ActionType, createAsyncAction } from 'typesafe-actions';
import { MeldeformDetaljerInn, Meldeperiode, Person } from '../types/person';

export enum PersonTypeKeys {
    HENT_PERSON = 'HENT_PERSON',
    HENT_PERSON_OK = 'HENT_PERSON_OK',
    HENT_PERSON_FEILET = 'HENT_PERSON_FEILET',

}

export const PersonActions = {
    hentPerson: createAsyncAction(
        PersonTypeKeys.HENT_PERSON,
        PersonTypeKeys.HENT_PERSON_OK,
        PersonTypeKeys.HENT_PERSON_FEILET
    )<void, Person, AxiosError>(),
};

export type PersonActionTypes = ActionType<typeof PersonActions>;