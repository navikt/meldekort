import { createBrowserHistory } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, connectRouter, RouterState } from 'connected-react-router';
import meldekortReducer, { MeldekortState } from '../reducers/meldekortReducer';
import demoReducer, { DemoState } from '../reducers/demoReducer';
import { LocalesState, default as localesReducer } from '../reducers/localesReducer';
import { intlReducer, IntlState } from 'react-intl-redux';

export const history = createBrowserHistory({
    basename: '/meldekort'
});

/*
// Const & types
const UPDATE_LOCALES = 'UPDATE_LOCALES';

export type LocalesActions = ActionType<typeof actions>;

// LocalesState
export interface LocalesState {
    locale: LocaleEnum;
    messages: {};
}

const initialState: LocalesState = {
    locale: LocaleEnum.no,
    messages: {
        'app.greeting': 'Ciao',
    }
};

// LocalesReducer
function localesReducer(state: LocalesState = initialState,
                        action: LocalesActions) {
    switch (action.type) {
        case UPDATE_LOCALES:
            console.log('Locale action works!', action.payload);
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
} */

export interface RootState {
    demo: DemoState;
    meldekort: MeldekortState;
    intl: IntlState;
    locales: LocalesState;
    router: RouterState;
}

const rootReducer = combineReducers({
    demo: demoReducer,
    meldekort: meldekortReducer,
    intl: intlReducer,
    locales: localesReducer,
    router: connectRouter(history),
});

const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(routerMiddleware(history))
    )
);

export { store };