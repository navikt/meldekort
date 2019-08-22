import { Meldekort } from '../types/meldekort';
import { getType } from 'typesafe-actions';
import {
  HistoriskeMeldekortActions,
  HistoriskeMeldekortActionTypes,
} from '../actions/historiskeMeldekort';

export interface HistoriskeMeldekortState {
  historiskeMeldekort: Meldekort[];
  ingenTidligereMeldekort: boolean;
}

const initalState: HistoriskeMeldekortState = {
  historiskeMeldekort: [],
  ingenTidligereMeldekort: false,
};

const historiskeMeldekortReducer = (
  state: HistoriskeMeldekortState = initalState,
  action: HistoriskeMeldekortActionTypes
): HistoriskeMeldekortState => {
  switch (action.type) {
    case getType(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success):
      return {
        historiskeMeldekort: action.payload,
        ingenTidligereMeldekort: initalState.ingenTidligereMeldekort,
      };

    default:
      return state;
  }
};

export default historiskeMeldekortReducer;
