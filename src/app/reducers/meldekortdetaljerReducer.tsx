import { Meldekortdetaljer } from '../types/meldekort';
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
        kortType: '',
        meldeDato: Date.prototype,
        lestDato: Date.prototype,
        sporsmal: [],
        begrunnelse: ''
    }
};

const meldekortdetaljerReducer = (state: MeldekortdetaljerState = initialState,
                                  action: MeldekortdetaljerActionTypes): MeldekortdetaljerState => {
    switch (action.type) {
        case getType(MeldekortdetaljerActions.hentMeldekortdetaljer.success):

            console.log('legger til meldekortdetaljer', action.payload);
            return {
                meldekortdetaljer: action.payload,
            };

        default:
            return state;
    }
};

export default meldekortdetaljerReducer;