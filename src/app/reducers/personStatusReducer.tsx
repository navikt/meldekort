import { PersonStatus } from '../types/person';
import { PersonStatusActions, PersonStatusActionTypes } from '../actions/personStatus';
import { getType } from 'typesafe-actions';

export interface PersonStatusState {
    personStatus: PersonStatus;
}

const initialState: PersonStatusState = {
    personStatus: {
        id: '',
        statusArbeidsoker: '',
        statusYtelse: ''
    }
};

const personStatusReducer = (state: PersonStatusState = initialState,
                             action: PersonStatusActionTypes): PersonStatusState => {
    switch (action.type) {
        case getType(PersonStatusActions.hentPersonStatus.success):

            console.log('legger til personStatus', action.payload);
            return {
                personStatus: action.payload,
            };

        default:
            return state;
    }
};

export default personStatusReducer;
