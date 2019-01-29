import { createBrowserHistory } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, RouterState, connectRouter } from 'connected-react-router';
import meldekortReducer, { MeldekortState } from '../reducers/meldekortReducer';
import demoReducer, { DemoState } from '../reducers/demoReducer';
import { LocalesState, default as localesReducer } from '../reducers/localesReducer';
// import { intlReducer } from 'react-intl-redux';

export const history = createBrowserHistory({
    basename: '/meldekort'
});

export interface RootState {
    demo: DemoState;
    meldekort: MeldekortState;
    locales: LocalesState;
    router: RouterState;
}

const rootReducer = combineReducers<RootState>({
    demo: demoReducer,
    meldekort: meldekortReducer,
    // intl: intlReducer,
    locales: localesReducer,
    router: connectRouter(history),
});

const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// let middleware: any[] = [routerMiddleware(history), composeWithDevTools()];
// const appliedMiddleware = applyMiddleware( ...middleware);
const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(routerMiddleware(history))
    )
);

export { store };