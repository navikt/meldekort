import { Meldekort } from '../types/meldekort';
import { getType } from 'typesafe-actions';
import { HistoriskeMeldekortActions, HistoriskeMeldekortActionTypes } from '../actions/historiskeMeldekort';

export interface HistoriskeMeldekortState {
    historiskeMeldekort: Meldekort[];
}

const initalState: HistoriskeMeldekortState = {
    historiskeMeldekort: []
};

const historiskeMeldekortReducer = (state: HistoriskeMeldekortState = initalState,
                                    action: HistoriskeMeldekortActionTypes): HistoriskeMeldekortState => {
    switch (action.type) {
        case getType(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success):

            return {
                historiskeMeldekort: action.payload,
            };

        default:
            return state;
    }
};

export default historiskeMeldekortReducer;