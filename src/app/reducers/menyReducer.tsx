import { MenyState } from '../types/meny';
import menyConfig from '../utils/menyConfig';
import { MenyActions, MenyActionTypes } from '../actions/meny';
import { getType } from 'typesafe-actions';

const initialState: MenyState = {
    valgtMenyPunkt: menyConfig[0],
    alleMenyPunkter: menyConfig,
    erApen: true,
};

const menyReducer = (state: MenyState = initialState,
                     action: MenyActionTypes): MenyState => {
    switch (action.type) {
        case getType(MenyActions.settValgtMenyPunkt):
            return { ...state, valgtMenyPunkt: action.payload };

        case getType(MenyActions.settAktiveMenyPunkter):
            return { ...state, alleMenyPunkter: action.payload };

        case getType(MenyActions.toggleMeny):
            return { ...state, erApen: action.payload };

        default:
            return state;
    }
};

export default menyReducer;