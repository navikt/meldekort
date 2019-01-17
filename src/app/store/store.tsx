import createBrowserHistory from 'history/createBrowserHistory';
import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { demoReducer } from '../reducers/demoReducer';
import { DemoState } from '../types/demo';
import { meldekortReducer } from '../reducers/meldekortReducer';
import { MeldekortState } from '../types/meldekort';

export const history = createBrowserHistory({
    basename: '/'
});

// Rootstate kan bli importert fordi det står export foran. import {RootState}
// Kan legge inn flere reducerStates når det trengts.
export interface RootState {
    demo: DemoState;
    meldekort: MeldekortState;
}

const rootReducer = combineReducers<RootState>({
        demo: demoReducer,
        meldekort: meldekortReducer
});
/* eslint-disable no-underscore-dangle */
// applyMiddleware skl være inni composeWithDevTools
const store = createStore(
    rootReducer, composeWithDevTools());
/* eslint-enable */

export default store;
// eksporterer store som default,
// import hvilkensomhelsttekst fra denne klassen vil returnere store funksjonen.