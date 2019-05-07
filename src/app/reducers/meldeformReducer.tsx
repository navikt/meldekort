import { MeldeForm, MeldeformDetaljerInn, Meldeperiode } from '../types/person';
import { MeldeformActions, MeldeformActionTypes } from '../actions/meldeform';
import { getType } from 'typesafe-actions';

export interface MeldeformState {
    meldeformDetaljer: MeldeformDetaljerInn;
    meldeperiode: Meldeperiode;
}

const initialState: MeldeformState = {
    meldeformDetaljer: {
        meldeformNavn: MeldeForm.IKKE_SATT.valueOf(),
    },
    meldeperiode: {
        id: '',
        meldeperiodeNavn: '',
        fraDato: new Date(),
        tilDato: new Date()
    }
};

const meldeformReducer = (state: MeldeformState = initialState,
                          action: MeldeformActionTypes): MeldeformState => {
    switch (action.type) {
        case getType(MeldeformActions.endreMeldeform.success):
            return {
                ...state, meldeperiode: action.payload
            };
        case getType(MeldeformActions.settMeldeform):
            return {
                ...state, meldeformDetaljer: action.payload
            };
        default:
            return state;
    }
};

export default meldeformReducer;