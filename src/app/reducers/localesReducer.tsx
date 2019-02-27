import { Constants, LocalesActions } from '../types/locales';
import tekster from '../tekster/kompilerte-tekster';

export interface LocalesState {
    nb: {};
    en: {};
}

const initialState: LocalesState = {
    nb: tekster.nb,
    en: tekster.en,
};

const localesReducer = (state: LocalesState = initialState,
                        action: LocalesActions): LocalesState => {

    switch (action.type) {
        case Constants.UPDATE_LOCALES:
            return { ...state,  ...action.payload };

        default:
            return state;
    }
};

export default localesReducer;