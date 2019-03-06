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
            til: new Date(),
            fra: new Date(),
            kortKanSendesFra: new Date(),
            periodeKode: ''
        },
        meldegruppe: Meldegruppe.NULL,
        kortStatus: KortStatus.VENTE,
        bruttoBelop: 0,
        mottattDato: new Date(),
        korrigerbart: false

    }
};

const aktivtMeldekortReducer = (state: AktivtMeldekortState = initialState,
                                action: AktivtMeldekortActions): AktivtMeldekortState => {
    switch (action.type) {
        case Constants.LEGG_TIL_AKTIVT_MELDEKORT:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default aktivtMeldekortReducer;