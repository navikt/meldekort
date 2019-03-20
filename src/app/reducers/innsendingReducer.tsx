import { InnsendingState } from '../types/innsending';
import { InnsendingActions, InnsendingActionsTypes } from '../actions/innsending';
import { getType } from 'typesafe-actions';
import { hentSporsmalConfig } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { hentUtfyltDagConfig } from '../sider/innsending/utfyllingsside/utfylling/utfyllingConfig';

const initialState: InnsendingState = {
    meldekortId: 0,
    innsendingstype: null,
    sporsmalsobjekter: hentSporsmalConfig(),
    utfylteDager: hentUtfyltDagConfig(),
};

const innsendingReducer = (state: InnsendingState = initialState,
                           action: InnsendingActionsTypes) : InnsendingState => {
    switch (action.type) {
        case getType(InnsendingActions.oppdaterUtfylteDager):
            return { ...state, utfylteDager: action.payload };

        case getType(InnsendingActions.oppdaterSpm):
            return { ...state, sporsmalsobjekter: action.payload };

        case getType(InnsendingActions.leggTilMeldekortId):
            return { ...state, meldekortId: action.payload };

        case getType(InnsendingActions.leggTilInnsendingstype):
            return {...state, innsendingstype: action.payload };

        case getType(InnsendingActions.resetInnsending):
            return {...initialState };

        case getType(InnsendingActions.hentKorrigertId.success):
            return {
                ...state,
                meldekortId: action.payload
            };

        default:
            return state;
    }
};

export default innsendingReducer;