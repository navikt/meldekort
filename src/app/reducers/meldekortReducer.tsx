import { SendteMeldekortState } from '../types/meldekort';
import { MeldekortActionTypes, MeldekortActions } from '../actions/meldekort';
import { getType } from 'typesafe-actions';

const initialState: SendteMeldekortState = {
  sendteMeldekort: [],
};

const meldekortReducer = (
  state: SendteMeldekortState = initialState,
  action: MeldekortActionTypes
): SendteMeldekortState => {
  switch (action.type) {
    case getType(MeldekortActions.leggTilInnsendtMeldekort):
      return { ...state, sendteMeldekort: action.payload };
    default:
      return state;
  }
};

export default meldekortReducer;
