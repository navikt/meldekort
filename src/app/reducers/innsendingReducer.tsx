import { InnsendingState, Innsendingstyper, InnsendingTypeKeys } from '../types/innsending';
import { InnsendingActions, InnsendingActionsTypes } from '../actions/innsending';
import { hentSporsmalConfig } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { KortStatus } from '../types/meldekort';
import { getType } from 'typesafe-actions';

const initialState: InnsendingState = {
    meldekortId: 0,
    innsendingstype: null,
    sporsmalsobjekter: hentSporsmalConfig(),
};

const innsendingReducer = (state: InnsendingState = initialState,
                           action: InnsendingActionsTypes) : InnsendingState => {
    switch (action.type) {

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
                meldekortId: action.payload,
                ...action.payload
            };

        default:
            return state;
    }
};

export default innsendingReducer;

