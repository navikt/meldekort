import { Skrivemodus } from '../types/skrivemodus';
import { SkrivemodusActions, SkrivemodusActionTypes } from '../actions/skrivemodus';
import { getType } from 'typesafe-actions';

const initialState: Skrivemodus = {
  skrivemodus: true,
  melding: null
};

const skrivemodusReducer = (
  state: Skrivemodus = initialState,
  action: SkrivemodusActionTypes
): Skrivemodus => {
  if (action.type === getType(SkrivemodusActions.hentSkrivemodus.success)) {
    return {
      skrivemodus: action.payload.skrivemodus,
      melding:
        action.payload.melding === undefined ? null : action.payload.melding,
    };
  } else {
    return state;
  }
};

export default skrivemodusReducer;
