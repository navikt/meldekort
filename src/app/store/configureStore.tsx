import { createBrowserHistory } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, connectRouter, RouterState } from 'connected-react-router';
import meldekortReducer, { MeldekortState } from '../reducers/meldekortReducer';
import demoReducer, { DemoState } from '../reducers/demoReducer';
import { LocalesState, default as localesReducer } from '../reducers/localesReducer';
import { intlReducer, IntlState } from 'react-intl-redux';
import { hentNbTekster } from '../tekster/tekster_nb';

export const history = createBrowserHistory({
    basename: '/meldekort'
});

const initialState = {
    intl: {
        locale: 'nb',
        messages: hentNbTekster()
    }
};

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
    initialState as any,
    composeEnhancer(applyMiddleware(routerMiddleware(history))
    )
);

export {store};