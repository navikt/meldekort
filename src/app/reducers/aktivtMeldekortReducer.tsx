import { AktivtMeldekortActions } from '../actions/aktivtMeldekort';
import { Constants } from '../types/meldekort';

export interface AktivtMeldekortState {
    meldekortId: number;
}

const initialState: AktivtMeldekortState = {
    meldekortId: 0,
};

const aktivtMeldekortReducer = (state: AktivtMeldekortState = initialState,
                                action: AktivtMeldekortActions): AktivtMeldekortState => {
    switch (action.type) {
        case Constants.LEGG_TIL_AKTIVT_MELDEKORT:
            console.log('legger til aktiv meldekort', action.payload);
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default aktivtMeldekortReducer;