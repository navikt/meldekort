import { Skrivemodus } from '../types/skrivemodus';
import { WeblogicActions, WeblogicActionTypes } from '../actions/skrivemodus';
import { getType } from 'typesafe-actions';

const initialState: Skrivemodus = {
  skrivemodus: true,
  melding: null,
};

const skrivemodusReducer = (
  state: Skrivemodus = initialState,
  action: WeblogicActionTypes
): Skrivemodus => {
  if (action.type === getType(WeblogicActions.pingWeblogic.success)) {
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
