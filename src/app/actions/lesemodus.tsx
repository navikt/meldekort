import { ActionType, createAsyncAction } from 'typesafe-actions';
import { Lesemodus } from '../types/lesemodus';
import { AxiosError } from 'axios';

export enum LesemodusTypeKeys {
  LESEMODUS = 'LESEMODUS',
  LESEMODUS_FALSE = 'LESEMODUS_FALSE',
  LESEMODUS_TRUE = 'LESEMODUS_TRUE',
}

export const LesemodusActions = {
  lesemodus: createAsyncAction(
    LesemodusTypeKeys.LESEMODUS,
    LesemodusTypeKeys.LESEMODUS_FALSE,
    LesemodusTypeKeys.LESEMODUS_TRUE
  )<void, Lesemodus, AxiosError>(),
};

export type LesemodusActionTypes = ActionType<typeof LesemodusActions>;
