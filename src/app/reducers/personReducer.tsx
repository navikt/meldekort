import { MeldeForm, Person } from '../types/person';
import { getType } from 'typesafe-actions';
import { PersonActions, PersonActionTypes } from '../actions/person';

const initialState: Person = {
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
};

const personReducer = (state: Person = initialState,
                       action: PersonActionTypes): Person => {
    switch (action.type) {
        case getType(PersonActions.hentPerson.success):
            return {
                ...state, ...action.payload,
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