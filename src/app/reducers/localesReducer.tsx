import { Constants, LocalesActions } from '../types/locales';

export interface LocalesState {
    locale: string;
    messages: {
        'app.greeting': 'Ciao',
    };
}

const initialState: LocalesState = {
    locale: 'it',
    messages: {
        'app.greeting': 'Ciao',
    }
};

const localesReducer = (state: LocalesState = initialState,
                        action: LocalesActions): LocalesState => {

    switch (action.type) {
        case Constants.UPDATE_LOCALES:
            console.log('Locale action works!');
            return { ...state,  ...action.payload };

        default:
            return state;
    }
};

export default localesReducer;