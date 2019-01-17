import { Constants, MeldekortState, MeldekortActions } from '../types/meldekort';

// defining inital state
const initalState: MeldekortState = {
    meldekort: []
};

// when called for the first time, it will return initial state.
export function meldekortReducer(
    state: MeldekortState = initalState,
    action: MeldekortActions): MeldekortState {

    // If case, action type = ADD_ITEM, add item from actions payload to state field list
    switch (action.type) {

        case Constants.LEGG_TIL_MELDEKORT:
            // Logikk bak legg til meldekort action
            // return { ..state, meldekort: [id: ]}
            return {
                ...state, meldekort: [
                    ...state.meldekort, action.payload.mk
                ]
            };
        default:
            return state;
    }
}