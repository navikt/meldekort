import { WeblogicPing } from '../types/weblogic';
import { WeblogicActions, WeblogicActionTypes } from '../actions/weblogic';
import { getType } from 'typesafe-actions';

const initialState: WeblogicPing = {
  erWeblogicOppe: true,
  melding: null,
};

const weblogicReducer = (
  state: WeblogicPing = initialState,
  action: WeblogicActionTypes
): WeblogicPing => {
  if (action.type === getType(WeblogicActions.pingWeblogic.success)) {
    return {
      erWeblogicOppe: action.payload.erWeblogicOppe,
      melding:
        action.payload.melding === undefined ? null : action.payload.melding,
    };
  } else {
    return state;
  }
};

export default weblogicReducer;
