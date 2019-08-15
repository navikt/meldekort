import { ActionType, createStandardAction } from 'typesafe-actions';
import {
  BaksystemFeilmelding,
  IModal,
  IngenTidligereMeldekort,
} from '../types/ui';

export enum UiTypeKeys {
  SKJUL_MODAL = 'SKJUL_MODAL',
  VIS_MODAL = 'VIS_MODAL',
  SKJUL_BAKSYSTEM_FEILMELDING = 'SKJUL_BAKSYSTEM_FEILMELDING',
  VIS_BAKSYSTEM_FEILMELDING = 'VIS_BAKSYSTEM_FEILMELDING',
  SJEKK_TIDLIGERE_MELDEKORT = 'SJEKK_TIDLIGERE_MELDEKORT',
}

export const UiActions = {
  skjulModal: createStandardAction(UiTypeKeys.SKJUL_MODAL)<void>(),
  visModal: createStandardAction(UiTypeKeys.VIS_MODAL)<IModal>(),
  skjulBaksystemFeilmelding: createStandardAction(
    UiTypeKeys.SKJUL_BAKSYSTEM_FEILMELDING
  )<void>(),
  visBaksystemFeilmelding: createStandardAction(
    UiTypeKeys.VIS_BAKSYSTEM_FEILMELDING
  )<BaksystemFeilmelding>(),
  sjekkTidligereMeldekort: createStandardAction(
    UiTypeKeys.SJEKK_TIDLIGERE_MELDEKORT
  )<IngenTidligereMeldekort>(),
};
export type UiActionTypes = ActionType<typeof UiActions>;
