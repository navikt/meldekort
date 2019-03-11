import { Constants, InnsendingState, Innsendingstyper } from '../types/innsending';
import { InnsendingActions } from '../actions/innsending';
import { hentSporsmalConfig } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { KortStatus } from '../types/meldekort';

const initialState: InnsendingState = {
    meldekortId: 0,
    kortStatus: KortStatus.OPPRE,
    innsendingstype: Innsendingstyper.innsending,
    sporsmalsobjekter: hentSporsmalConfig(),
};

const innsendingReducer = (state: InnsendingState = initialState,
                           action: InnsendingActions) : InnsendingState => {
    switch (action.type) {

        case Constants.OPPDATER_SPM:
            return { ...state, ...action.payload };

        case Constants.LEGG_TIL_MELDEKORTID:
            return { ...state, ...action.payload };

        case Constants.LEGG_TIL_INNSENDINGSTYPE:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default innsendingReducer;

