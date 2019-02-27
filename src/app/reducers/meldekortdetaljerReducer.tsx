import { KortType, Meldekortdetaljer } from '../types/meldekort';
import { MeldekortdetaljerActions, MeldekortdetaljerActionTypes } from '../actions/meldekortdetaljer';
import { getType } from 'typesafe-actions';

export interface MeldekortdetaljerState {
    meldekortdetaljer: Meldekortdetaljer;
}

const initialState: MeldekortdetaljerState = {
    meldekortdetaljer: {
        id: '',
        personId: 0,
        fodselsnr: '',
        meldekortId: 0,
        meldeperiode: '',
        arkivnokkel: '',
        kortType: KortType.KORRIGERT_ELEKTRONISK,
        meldeDato: Date.prototype,
        lestDato: Date.prototype,
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
    }
};

const meldekortdetaljerReducer = (state: MeldekortdetaljerState = initialState,
                                  action: MeldekortdetaljerActionTypes): MeldekortdetaljerState => {
    switch (action.type) {
        case getType(MeldekortdetaljerActions.hentMeldekortdetaljer.success):

            return {
                meldekortdetaljer: action.payload,
            };

        default:
            return state;
    }
};

export default meldekortdetaljerReducer;