import { Constants, LocalesActions } from '../types/locales';
import { hentNbTekster } from '../tekster/tekster_nb';
import { hentEnTekster } from '../tekster/tekster_en';

export interface LocalesState {
    nb: {};
    en: {};
}

const initialState: LocalesState = {
    nb: hentNbTekster(),
    en: hentEnTekster(),
};

const localesReducer = (state: LocalesState = initialState,
                        action: LocalesActions): LocalesState => {

    switch (action.type) {
        case Constants.UPDATE_LOCALES:
            console.log('update Locales', action.payload);
            return { ...state,  ...action.payload };

        default:
            return state;
    }
};

export default localesReducer;