// Redux Store

import { combineReducers, createStore } from 'redux';
import { demoReducer } from '../reducers/demoReducer';
import { DemoState } from '../types/demo';
import createBrowserHistory from 'history/createBrowserHistory';
import { MeldekortState } from '../reducers/meldekortReducer';
import { meldekortReducer } from '../reducers/meldekortReducer';

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

const store = createStore(rootReducer);

export default store;
// eksporterer store som default,
// import hvilkensomhelsttekst fra denne klassen vil returnere store funksjonen.