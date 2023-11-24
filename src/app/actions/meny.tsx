import { ActionType, createAction } from 'typesafe-actions';
import { MenyTypeKeys } from '../types/meny';
import { MenyPunkt } from '../utils/menyConfig';

export const MenyActions = {
  settValgtMenyPunkt: createAction(MenyTypeKeys.SETT_VALGT_MENYPUNKT)<
    MenyPunkt
  >(),
  settAktiveMenyPunkter: createAction(
    MenyTypeKeys.SETT_AKTIVE_MENYPUNKTER
  )<MenyPunkt[]>(),
  toggleMeny: createAction(MenyTypeKeys.TOGGLE_MENY)<boolean>()
};

export type MenyActionTypes = ActionType<typeof MenyActions>;
