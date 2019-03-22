import { MeldeForm, Person } from '../types/person';
import { getType } from 'typesafe-actions';
import { PersonActions, PersonActionTypes } from '../actions/person';

export interface PersonState {
    person: Person;
}

const initialState: PersonState = {
    person: {
        personId: 0,
        fodselsnr: '',
        etternavn: '',
        fornavn: '',
        maalformkode: '',
        meldeform: MeldeForm.IKKE_SATT,
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
            return {
                person: action.payload,
            };
        case getType(PersonActions.endreMeldeform):
            return {
                ...state, meldeform: action.payload,
            };

        default:
            return state;
    }
};

export default personReducer;