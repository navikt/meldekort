import { PersonInfo } from '../types/person';
import {
  PersonInfoActions,
  PersonInfoActionTypes,
} from '../actions/personInfo';
import { getType } from 'typesafe-actions';

export interface PersonInfoState {
  personInfo: PersonInfo;
}

const initialState: PersonInfoState = {
  personInfo: {
    personId: 0,
    fodselsnr: '',
    etternavn: '',
    fornavn: '',
  },
};

const personInfoReducer = (
  state: PersonInfoState = initialState,
  action: PersonInfoActionTypes
): PersonInfoState => {
  switch (action.type) {
    case getType(PersonInfoActions.hentPersonInfo.success):
      return {
        personInfo: action.payload,
      };

    default:
      return state;
  }
};

export default personInfoReducer;
