import { Lesemodus } from '../types/lesemodus';
import { LesemodusActions, LesemodusActionTypes } from '../actions/lesemodus';
import { getType } from 'typesafe-actions';

const initialState: Lesemodus = {
  lesemodus: false,
  melding: null,
};

const lesemodusReducer = (
  state: Lesemodus = initialState,
  action: LesemodusActionTypes
): Lesemodus => {
  if (action.type === getType(LesemodusActions.lesemodus.success)) {
    return {
      lesemodus: action.payload.lesemodus,
      melding:
        action.payload.melding === undefined ? null : action.payload.melding,
    };
  } else {
    return state;
  }
};

export default lesemodusReducer;
