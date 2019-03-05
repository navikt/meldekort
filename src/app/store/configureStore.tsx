import storage from 'redux-persist/lib/storage/session';

import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';
// import logger from 'redux-logger';

import aktivtMeldekortReducer, { AktivtMeldekortState } from '../reducers/aktivtMeldekortReducer';
import historiskeMeldekortReducer, { HistoriskeMeldekortState } from '../reducers/historiskeMeldekortReducer';
import meldekortdetaljerReducer, { MeldekortdetaljerState } from '../reducers/meldekortdetaljerReducer';
import personReducer, { PersonState } from '../reducers/personReducer';
import personStatusReducer, { PersonStatusState } from '../reducers/personStatusReducer';
import tekster from '../tekster/kompilerte-tekster';
import { default as localesReducer, LocalesState } from '../reducers/localesReducer';
import { intlReducer, IntlState } from 'react-intl-redux';

import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import historiskeMeldekortEpics from '../epics/historiskeMeldekortEpics';
import meldekortdetaljerEpics from '../epics/meldekortdetaljerEpics';
import personEpics from '../epics/personEpics';
import personStatusEpics from '../epics/personStatusEpics';
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import innsendingReducer from '../reducers/innsendingReducer';
import { InnsendingState } from '../types/innsending';

export const history = createBrowserHistory({
    basename: '/meldekort'
});

const packageConfig = require('../../../package.json');

const initialState = {
    intl: {
        locale: 'nb',
        messages: tekster.nb
    }
};

export interface RootState {
    locales: LocalesState;
    intl: IntlState;
    router: RouterState;
    person: PersonState;
    personStatus: PersonStatusState;
    meldekortdetaljer: MeldekortdetaljerState;
    aktivtMeldekort: AktivtMeldekortState;
    historiskeMeldekort: HistoriskeMeldekortState;
    innsending: InnsendingState;
}

export type AppEpic = Epic<Action, Action, RootState>;

const rootReducer = combineReducers({
    locales: localesReducer,
    intl: intlReducer,
    router: connectRouter(history),
    person: personReducer,
    personStatus: personStatusReducer,
    meldekortdetaljer: meldekortdetaljerReducer,
    aktivtMeldekort: aktivtMeldekortReducer,
    historiskeMeldekort: historiskeMeldekortReducer,
    innsending: innsendingReducer
});

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
let middleware: any[] = [routerMiddleware(history), epicMiddleware];
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'cake', //`meldekort:${packageConfig.redux_version}`,
    storage,
    // Hvis du ønsker at noe ikke skal persistes, legg det i blacklist.
    blacklist: ['intl', 'locales', 'router'],
    // stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const appliedMiddleware = applyMiddleware(...middleware, routerMiddleware(history)); //, logger);

const store = createStore(persistedReducer,
    initialState as any,
    composeEnhancer(appliedMiddleware)
);

console.log(store.getState());

const persistor = persistStore(store);

epicMiddleware.run(
    combineEpics(
        personEpics,
        personStatusEpics,
        historiskeMeldekortEpics,
        meldekortdetaljerEpics,
    )
);

export { store, persistor };