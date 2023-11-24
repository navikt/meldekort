import { BaksystemFeilmelding, IModal, IngenTidligereMeldekort } from '../types/ui';
import { UiActions, UiActionTypes } from '../actions/ui';
import { getType } from 'typesafe-actions';

export interface UIState {
  modal: IModal;
  baksystemFeilmelding: BaksystemFeilmelding;
  ingenTidligereMeldekort: IngenTidligereMeldekort;
  loading: boolean;
  numberOfLoading: number;
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
  loading: false,
  numberOfLoading: 0
};

const uiReducer = (
  state: UIState = initialState,
  action: UiActionTypes
): UIState => {
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
    case getType(UiActions.startLoading):
      return {
        ...state,
        loading: true,
        numberOfLoading: state.numberOfLoading + 1,
      };
    case getType(UiActions.stopLoading):
      return {
        ...state,
        loading: state.numberOfLoading - 1 != 0,
        numberOfLoading: state.numberOfLoading - 1,
      };
    default:
      return state;
  }
};

export default uiReducer;
