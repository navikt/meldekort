import { Constants, Meldekort, MeldekortActions } from '../types/meldekort';

// STATE
// A simple one field 'list' to store list of string in our state
export interface MeldekortState {
    meldekort: Meldekort;
}

// defining inital state
const initalState = {
    meldekort: {id:'00', arbeidet: true}
};

// when called for the first time, it will return initial state.
export function meldekortReducer(
    state: MeldekortState = initalState,
    action: MeldekortActions): MeldekortState {

    // If case, action type = ADD_ITEM, add item from actions payload to state field list
    switch (action.type) {

        case Constants.LEGG_TIL_MELDEKORT:
            return { ...state, ...action.payload};

        default:
            return state;
    }
}