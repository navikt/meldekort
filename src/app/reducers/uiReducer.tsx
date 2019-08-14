import { BaksystemFeilmelding, IModal, IngenTidligereMeldekort } from '../types/ui';
import { UiActions, UiActionTypes } from '../actions/ui';
import { getType } from 'typesafe-actions';

export interface UIState {
  modal: IModal;
  baksystemFeilmelding: BaksystemFeilmelding;
  ingenTidligereMeldekort: IngenTidligereMeldekort;
}

const initialState: UIState = {
  modal: {
    content: () => '',
    visModal: false,
  },
  baksystemFeilmelding: {
    content: () => '',
    visFeilmelding: false,
  },
  ingenTidligereMeldekort: {
    harTidligereMeldekort: true,
  },
};

const uiReducer = (state: UIState = initialState, action: UiActionTypes): UIState => {
  switch (action.type) {
    case getType(UiActions.visModal):
      return {
        ...state,
        modal: action.payload,
      };
    case getType(UiActions.skjulModal):
      return {
        ...state,
        modal: initialState.modal,
      };
    case getType(UiActions.visBaksystemFeilmelding):
      return {
        ...state,
        baksystemFeilmelding: action.payload,
      };
    case getType(UiActions.skjulBaksystemFeilmelding):
      return {
        ...state,
        baksystemFeilmelding: initialState.baksystemFeilmelding,
      };
    case getType(UiActions.sjekkTidligereMeldekort):
      return {
        ...state,
        ingenTidligereMeldekort: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;
