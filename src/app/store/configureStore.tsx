import { createBrowserHistory } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, RouterState, connectRouter } from 'connected-react-router';

import meldekortReducer, { MeldekortState } from '../reducers/meldekortReducer';
import demoReducer, { DemoState } from '../reducers/demoReducer';

export const history = createBrowserHistory({
    basename: '/meldekort'
});

// Rootstate kan bli importert fordi det står export foran. import {RootState}
// Kan legge inn flere reducerStates når det trengts.
export interface RootState {
    demo: DemoState;
    meldekort: MeldekortState;
    router: RouterState;
}
const rootReducer = combineReducers<RootState>({
    demo: demoReducer,
    meldekort: meldekortReducer,
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

/*
const rootReducer = combineReducers<RootState>({
        demo: demoReducer,
        meldekort: meldekortReducer
});

// applyMiddleware skl være inni composeWithDevTools
 configureStore = createStore(
    rootReducer, composeWithDevTools());

export default configureStore;*/