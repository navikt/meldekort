import { MenyState } from '../types/meny';
import menyConfig from '../utils/menyConfig';
import { MenyActions, MenyActionTypes } from '../actions/meny';
import { getType } from 'typesafe-actions';

const initialState: MenyState = {
    valgtMenyPunkt: menyConfig[0],
    aktiveMenyPunkter: menyConfig.filter( menyobj => !menyobj.disabled),
    menyConfig: menyConfig
};

const menyReducer = (state: MenyState = initialState,
                     action: MenyActionTypes): MenyState => {
    switch (action.type) {
        case getType(MenyActions.settValgtMenyPunkt):
            return { ...state, valgtMenyPunkt: action.payload };

        case getType(MenyActions.settAktiveMenyPunkter):
            return { ...state, aktiveMenyPunkter: action.payload };

        default:
            return state;
    }
};

export default menyReducer;