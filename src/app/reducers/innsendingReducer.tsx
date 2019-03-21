import { Constants, InnsendingState } from '../types/innsending';
import { InnsendingActions, KontrollerActions } from '../actions/innsending';
import { hentSporsmalConfig } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { hentUtfyltDagConfig } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';
import { KortType } from '../types/meldekort';
import { getType } from 'typesafe-actions';

const initialState: InnsendingState = {
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
                           action: InnsendingActions): InnsendingState => {
    switch (action.type) {

        case Constants.OPPDATER_SPM:
            return { ...state, ...action.payload };
        case Constants.OPPDATER_DAGER:
            return { ...state, ...action.payload };
        case Constants.OPPDATER_MELDEKORTDETALJER:
            return { ...state, ...action.payload };
        case Constants.SETT_MELDEKORTDETALJER_INNSEDNING:
            return { ...state, ...action.payload };
        case Constants.SETT_VALIDERINGSRESULTAT:
            return { ...state, ...action.payload };
        case getType(KontrollerActions.kontrollerMeldekort.success):
            return { ...state, ...action.payload, valideringsResultat: action.payload.valideringsresultat };

        default:
            return state;
    }
};

export default innsendingReducer;