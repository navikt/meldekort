import { Constants, LocalesActions } from '../types/locales';

export interface LocalesState {
    no: {};
    en: {};
}

const initialState: LocalesState = {
    no: {
        'app.greeting': 'Hei!',
    },
    en: {
        'app.greeting': 'Hello!',
    },
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