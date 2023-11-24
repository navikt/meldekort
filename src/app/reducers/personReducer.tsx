import { MeldeForm, Person } from '../types/person';
import { getType } from 'typesafe-actions';
import { PersonActions, PersonActionTypes } from '../actions/person';

const initialState: Person = {
  maalformkode: '',
  meldeform: MeldeForm.IKKE_SATT,
  meldekort: [],
  etterregistrerteMeldekort: [],
  fravaer: [],
  id: '',
  antallGjenstaaendeFeriedager: 0
};

const personReducer = (
  state: Person = initialState,
  action: PersonActionTypes
): Person => {
  if (action.type === getType(PersonActions.hentPerson.success)) {
    return {
      ...state,
      ...action.payload,
    };
  } else {
    return state;
  }
};

export default personReducer;
