import createBrowserHistory from 'history/createBrowserHistory';
import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { demoReducer } from '../reducers/demoReducer';
import { DemoState } from '../types/demo';
import { meldekortReducer } from '../reducers/meldekortReducer';
import { MeldekortState } from '../types/meldekort';

export const history = createBrowserHistory();

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

// applyMiddleware skl være inni composeWithDevTools
const configureStore = createStore(
    rootReducer, composeWithDevTools());

export default configureStore;