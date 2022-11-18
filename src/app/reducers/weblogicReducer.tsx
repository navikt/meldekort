import { WeblogicPing } from '../types/weblogic';
import { WeblogicActions, WeblogicActionTypes } from '../actions/weblogic';
import { getType } from 'typesafe-actions';

const initialState: WeblogicPing = {
  skrivemodus: true,
  melding: null,
};

const weblogicReducer = (
  state: WeblogicPing = initialState,
  action: WeblogicActionTypes
): WeblogicPing => {
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

export default weblogicReducer;
