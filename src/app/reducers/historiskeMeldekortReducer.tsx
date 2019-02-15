import { HistoriskeMeldekort } from '../types/meldekort';
import { getType } from 'typesafe-actions';
import { HistoriskeMeldekortActions, HistoriskeMeldekortActionTypes } from '../actions/historiskeMeldekort';

export interface HistoriskeMeldekortState {
    historiskeMeldekort: HistoriskeMeldekort;
}

const initalState: HistoriskeMeldekortState = {
    historiskeMeldekort: {
        historiskeMeldekort: []
    },
};

const historiskeMeldekortReducer = (state: HistoriskeMeldekortState = initalState,
                                    action: HistoriskeMeldekortActionTypes): HistoriskeMeldekortState => {
    switch (action.type) {
        case getType(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success):
            console.log('legger til historiske meldekort', action.payload);

            return {
                historiskeMeldekort: action.payload,
            };

        default:
            return state;
    }
};

export default historiskeMeldekortReducer;