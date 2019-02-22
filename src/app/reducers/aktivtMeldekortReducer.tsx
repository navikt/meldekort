import { AktivtMeldekortActions } from '../actions/aktivtMeldekort';
import { Constants, KortStatus, KortType, Meldegruppe, Meldekort } from '../types/meldekort';

export interface AktivtMeldekortState {
    meldekort: Meldekort;
}

const initialState: AktivtMeldekortState = {
    meldekort: {
        meldekortId: 0,
        kortType: KortType.RETUR,
        meldeperiode: {
            til: Date.prototype,
            fra: Date.prototype,
            kortKanSendesFra: Date.prototype,
            periodeKode: ''
        },
        meldegruppe: Meldegruppe.NULL,
        kortStatus: KortStatus.VENTE,
        bruttoBelop: 0,
        mottattDato: Date.prototype,
        korrigerbart: false

    }
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