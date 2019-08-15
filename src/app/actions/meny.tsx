import { ActionType, createStandardAction } from 'typesafe-actions';
import { MenyTypeKeys } from '../types/meny';
import { MenyPunkt } from '../utils/menyConfig';

export const MenyActions = {
  settValgtMenyPunkt: createStandardAction(MenyTypeKeys.SETT_VALGT_MENYPUNKT)<
    MenyPunkt
  >(),
  settAktiveMenyPunkter: createStandardAction(
    MenyTypeKeys.SETT_AKTIVE_MENYPUNKTER
  )<MenyPunkt[]>(),
  toggleMeny: createStandardAction(MenyTypeKeys.TOGGLE_MENY)<boolean>(),
};

export type MenyActionTypes = ActionType<typeof MenyActions>;
