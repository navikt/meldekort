import { KortStatus, KortType, Meldegruppe, Meldekort } from '../types/meldekort';
import { AktivtMeldekortActions, AktivtMeldekortActionsTypes } from '../actions/aktivtMeldekort';
import { getType } from 'typesafe-actions';

const initialState: Meldekort = {
        meldekortId: 0,
        kortType: KortType.RETUR,
        meldeperiode: {
            til: new Date(),
            fra: new Date(),
            kortKanSendesFra: new Date(),
            kanKortSendes: false,
            periodeKode: ''
        },
        meldegruppe: Meldegruppe.ATTF,
        kortStatus: KortStatus.VENTE,
        bruttoBelop: 0,
        mottattDato: new Date(),
        korrigerbart: false
};

const aktivtMeldekortReducer = (state: Meldekort = initialState,
                                action: AktivtMeldekortActionsTypes): Meldekort => {
    switch (action.type) {
        case getType(AktivtMeldekortActions.oppdaterAktivtMeldekort):
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default aktivtMeldekortReducer;