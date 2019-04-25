import storage from 'redux-persist/lib/storage/session';

import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';

import aktivtMeldekortReducer, { AktivtMeldekortState } from '../reducers/aktivtMeldekortReducer';
import historiskeMeldekortReducer, { HistoriskeMeldekortState } from '../reducers/historiskeMeldekortReducer';
import meldekortdetaljerReducer, { MeldekortdetaljerState } from '../reducers/meldekortdetaljerReducer';
import personReducer from '../reducers/personReducer';
import personStatusReducer, { PersonStatusState } from '../reducers/personStatusReducer';
import tekster from '../tekster/kompilerte-tekster';
import { default as localesReducer, LocalesState } from '../reducers/localesReducer';
import { intlReducer, IntlState } from 'react-intl-redux';

import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import historiskeMeldekortEpics from '../epics/historiskeMeldekortEpics';
import meldekortdetaljerEpics from '../epics/meldekortdetaljerEpics';
import personEpics from '../epics/personEpics';
import personStatusEpics from '../epics/personStatusEpics';
import innsendingReducer from '../reducers/innsendingReducer';
import { InnsendingState } from '../types/innsending';
import innsendingEpics from '../epics/innsendingEpics';
import uiReducer, { UIState } from '../reducers/uiReducer';
import meldekortEpics from '../epics/meldekortEpics';
import { Person } from '../types/person';
import { MenyState } from '../types/meny';
import menyReducer from '../reducers/menyReducer';
import meldeformReducer, { MeldeformState } from '../reducers/meldeformReducer';
import meldeformEpics from '../epics/meldeformEpics';

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
    person: Person;
    personStatus: PersonStatusState;
    meldekortdetaljer: MeldekortdetaljerState;
    aktivtMeldekort: AktivtMeldekortState;
    historiskeMeldekort: HistoriskeMeldekortState;
    innsending: InnsendingState;
    meldeform: MeldeformState;
    meny: MenyState;
    ui: UIState;
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
    innsending: innsendingReducer,
    meny: menyReducer,
    meldeform: meldeformReducer,
    ui: uiReducer,
});

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
let middleware: any[] = [routerMiddleware(history), epicMiddleware];
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: `meldekort:${packageConfig.redux_version}`,
    storage,
    // Hvis du ønsker at noe ikke skal persistes, legg det i blacklist.
    blacklist: ['locales', 'ui'],
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
        innsendingEpics,
        meldekortdetaljerEpics,
        meldekortEpics,
        meldeformEpics
    )
);

export { store, persistor };