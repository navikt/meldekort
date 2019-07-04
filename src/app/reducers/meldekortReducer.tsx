import { MeldekortState } from '../types/meldekort';
import { MeldekortActionTypes, MeldekortActions } from '../actions/meldekort';
import { getType } from 'typesafe-actions';

const initialState: MeldekortState = {
  sendteMeldekort: [],
  infomelding: {
    norsk: '',
    engelsk: '',
  },
};

const meldekortReducer = (
  state: MeldekortState = initialState,
  action: MeldekortActionTypes
): MeldekortState => {
  switch (action.type) {
    case getType(MeldekortActions.leggTilInnsendtMeldekort):
      return {
        ...state,
        sendteMeldekort: action.payload,
      };
    case getType(MeldekortActions.hentInfomelding.success):
      return {
        ...state,
        infomelding: action.payload,
      };
    default:
      return state;
  }
};

export default meldekortReducer;
