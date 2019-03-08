import { Constants, InnsendingState } from '../types/innsending';
import { InnsendingActions } from '../actions/innsending';
import { hentSporsmalConfig } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { hentUtfyltDagConfig } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';

const initialState: InnsendingState = {
    sporsmalsobjekter: hentSporsmalConfig(),
    utfylteDager: hentUtfyltDagConfig(),
};

const innsendingReducer = (state: InnsendingState = initialState,
                           action: InnsendingActions): InnsendingState => {
    switch (action.type) {

        case Constants.OPPDATER_SPM:
            return { ...state, ...action.payload };
        case Constants.OPPDATER_DAGER:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default innsendingReducer;

