import { InnsendingState } from '../types/innsending';
import { InnsendingActions, InnsendingActionsTypes } from '../actions/innsending';
import { getType } from 'typesafe-actions';
import { hentSporsmalConfig } from '../sider/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { hentUtfyltDagConfig } from '../sider/innsending/utfyllingsside/utfylling/utfyllingConfig';
import { KortType } from '../types/meldekort';

const initialState: InnsendingState = {
    meldekortId: 0,
    korrigertMeldekortId: 0,
    innsendingstype: null,
    sporsmalsobjekter: hentSporsmalConfig(),
    utfylteDager: hentUtfyltDagConfig(),
    meldekortdetaljer: {
        id: '',
        personId: 0,
        fodselsnr: '',
        meldekortId: 0,
        meldeperiode: '',
        arkivnokkel: '',
        kortType: KortType.KORRIGERT_ELEKTRONISK,
        meldeDato: new Date(),
        lestDato: new Date(),
        sporsmal: {
            annetFravaer: false,
            arbeidet: false,
            arbeidssoker: false,
            syk: false,
            kurs: false,
            signatur: false,
            meldekortDager: []
        },
        begrunnelse: ''
    },
    meldekortdetaljerInnsending: undefined,
    valideringsResultat: undefined
};

const innsendingReducer = (state: InnsendingState = initialState,
                           action: InnsendingActionsTypes): InnsendingState => {
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

        case getType(InnsendingActions.resetSporsmalOgUtfylling):
            return {...state, sporsmalsobjekter: hentSporsmalConfig(), utfylteDager: hentUtfyltDagConfig() };

        case getType(InnsendingActions.hentKorrigertId.success):
            return {
                ...state, korrigertMeldekortId: action.payload
            };
        case getType(InnsendingActions.oppdaterMeldekortdetaljer):
            return {...state, meldekortdetaljer: action.payload };

        case getType(InnsendingActions.settMeldekortdetaljerInnsending):
            return {...state, meldekortdetaljerInnsending: action.payload };

        case getType(InnsendingActions.settValideringsresultat):
            return {...state, ...action.payload, valideringsResultat: action.payload };

        default:
            return state;
    }
};

export default innsendingReducer;