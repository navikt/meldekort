import { LocalesActions } from '../types/locales';
import tekster from '../tekster/kompilerte-tekster';

export interface LocalesState {
    nb: {
        label: string,
        tittel: string,
        tekster: {}
    };
    en: {
        label: string,
        tittel: string,
        tekster: {}
    };
}

const initialState: LocalesState = {
    nb: {
        label: 'nb',
        tittel: 'Norsk',
        tekster: tekster.nb
    },
    en: {
        label: 'en',
        tittel: 'English',
        tekster: tekster.en
    },
};

const localesReducer = (state: LocalesState = initialState,
                        action: LocalesActions): LocalesState => {

    switch (action.type) {

        default:
            return state;
    }
};

export default localesReducer;