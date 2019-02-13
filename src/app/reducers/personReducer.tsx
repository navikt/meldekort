import { Person } from '../types/person';
import { getType } from 'typesafe-actions';
import { PersonActions, PersonActionTypes } from '../actions/person';

export interface PersonState {
    person: Person;
}

const initialState: PersonState = {
    person: {
        personId: 0,
        etternavn: '',
        fornavn: '',
        maalformkode: '',
        meldeform: '',
        meldekort: [],
        etterregistrerteMeldekort: [],
        fravaer: [],
        id: '',
        antallGjenstaaendeFeriedager: 0,
    }
};

const personReducer = (state: PersonState = initialState,
                       action: PersonActionTypes): PersonState => {
    switch (action.type) {
        case getType(PersonActions.hentPerson.success):

            console.log('legger til person', action.payload);
            return {
                person: action.payload,
            };

        default:
            return state;
    }
};

export default personReducer;