import { ActionType, createAsyncAction } from 'typesafe-actions';
import { Skrivemodus } from '../types/skrivemodus';
import { AxiosError } from 'axios';

export enum SkrivemodusTypeKeys {
  SKRIVEMODUS = 'SKRIVEMODUS',
  SKRIVEMODUS_TRUE = 'SKRIVEMODUS_TRUE',
  SKRIVEMODUS_FALSE = 'SKRIVEMODUS_FALSE',
}

export const SkrivemodusActions = {
  skrivemodus: createAsyncAction(
    SkrivemodusTypeKeys.SKRIVEMODUS,
    SkrivemodusTypeKeys.SKRIVEMODUS_TRUE,
    SkrivemodusTypeKeys.SKRIVEMODUS_FALSE
  )<void, Skrivemodus, AxiosError>(),
};

export type SkrivemodusActionTypes = ActionType<typeof SkrivemodusActions>;
