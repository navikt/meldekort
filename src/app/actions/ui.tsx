import { ActionType, createAction } from 'typesafe-actions';
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
  START_LOADING = 'START_LOADING',
  STOP_LOADING = 'STOP_LOADING',
}

export const UiActions = {
  skjulModal: createAction(UiTypeKeys.SKJUL_MODAL)<void>(),
  visModal: createAction(UiTypeKeys.VIS_MODAL)<IModal>(),
  skjulBaksystemFeilmelding: createAction(
    UiTypeKeys.SKJUL_BAKSYSTEM_FEILMELDING
  )<void>(),
  visBaksystemFeilmelding: createAction(
    UiTypeKeys.VIS_BAKSYSTEM_FEILMELDING
  )<BaksystemFeilmelding>(),
  sjekkTidligereMeldekort: createAction(
    UiTypeKeys.SJEKK_TIDLIGERE_MELDEKORT
  )<IngenTidligereMeldekort>(),
  startLoading: createAction(UiTypeKeys.START_LOADING)<void>(),
  stopLoading: createAction(UiTypeKeys.STOP_LOADING)<void>(),
};
export type UiActionTypes = ActionType<typeof UiActions>;
