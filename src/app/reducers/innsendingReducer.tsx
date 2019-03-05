import { Constants, InnsendingState } from '../types/innsending';
import { KortStatus, MeldekortDag } from '../types/meldekort';
import { InnsendingActions } from '../actions/innsending';
import { hentSporsmalConfig } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';

const initialState: InnsendingState = {
    meldekortId: 0,
    kortStatus: KortStatus.OPPRE,
    sporsmalsobjekter: hentSporsmalConfig(),
};

const innsendingReducer = (state: InnsendingState = initialState,
                           action: InnsendingActions) : InnsendingState => {
    switch (action.type) {
        case Constants.SETT_MELDEKORTINFO:
            return { ...state, ...action.payload };

        case Constants.LEGG_TIL_SVAR:
            return { ...state, ...action.payload };

        case Constants.OPPDATER_SPM:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default innsendingReducer;

