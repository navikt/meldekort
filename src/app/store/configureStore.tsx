import storage from 'redux-persist/lib/storage';
import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';

import aktivtMeldekortReducer, { AktivtMeldekortState } from '../reducers/aktivtMeldekortReducer';
import demoReducer, { DemoState } from '../reducers/demoReducer';
import historiskeMeldekortReducer, { HistoriskeMeldekortState } from '../reducers/historiskeMeldekortReducer';
import meldekortdetaljerReducer, { MeldekortdetaljerState } from '../reducers/meldekortdetaljerReducer';
import meldekortReducer, { MeldekortState } from '../reducers/meldekortReducer';
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
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';


export const history = createBrowserHistory({
    basename: '/meldekort'
});

const initialState = {
    intl: {
        locale: 'nb',
        messages: tekster.nb
    }
};

export interface RootState {
    demo: DemoState;
    meldekort: MeldekortState;
    intl: IntlState;
    locales: LocalesState;
    router: RouterState;
    person: PersonState;
    personStatus: PersonStatusState;
    historiskeMeldekort: HistoriskeMeldekortState;
    meldekortdetaljer: MeldekortdetaljerState;
    aktivtMeldekort: AktivtMeldekortState;
}

export type AppEpic = Epic<Action, Action, RootState>;

const rootReducer = combineReducers({
    demo: demoReducer,
    meldekort: meldekortReducer,
    intl: intlReducer,
    locales: localesReducer,
    router: connectRouter(history),
    person: personReducer,
    personStatus: personStatusReducer,
    historiskeMeldekort: historiskeMeldekortReducer,
    meldekortdetaljer: meldekortdetaljerReducer,
    aktivtMeldekort: aktivtMeldekortReducer,
});

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
let middleware: any[] = [routerMiddleware(history), epicMiddleware];
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'root',
    storage,
    // Hvis du ønsker at noe ikke skal persistes, legg det i blacklist.
    whitelist: ['intl','locales', 'person', 'personStatus', 'historiskeMeldekort', 'meldekortdetaljer', 'aktivtMeldekort'],
    stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const appliedMiddleware = applyMiddleware(...middleware, routerMiddleware(history));

const store = createStore(persistedReducer,
    initialState as any,
    composeEnhancer(appliedMiddleware)
);
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