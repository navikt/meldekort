import { RootState } from '../store/configureStore';
import {
  BaksystemFeilmelding,
  IModal,
  IngenTidligereMeldekort,
} from '../types/ui';

export const selectModal = (state: RootState): IModal => {
  return state.ui.modal;
};

export const selectFeilmelding = (state: RootState): BaksystemFeilmelding => {
  return state.ui.baksystemFeilmelding;
};

export const selectIngenTidligereMeldekort = (
  state: RootState
): IngenTidligereMeldekort => {
  return state.ui.ingenTidligereMeldekort;
};
