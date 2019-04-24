import storage from 'redux-persist/lib/storage/session';

import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';
// import logger from 'redux-logger';

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
import meldeformReducer, { MeldeformState } from '../reducers/meldeformReducer';
import meldeformEpics from '../epics/meldeformEpics';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';
import { MeldekortActions } from '../actions/meldekort';
import { AxiosResponse } from 'axios';

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
    ui: UIState;
}

export type AppEpic = Epic<Action, Action, RootState>;

const appReducer = combineReducers({
    locales: localesReducer,
    intl: intlReducer,
    router: connectRouter(history),
    person: personReducer,
    personStatus: personStatusReducer,
    meldekortdetaljer: meldekortdetaljerReducer,
    aktivtMeldekort: aktivtMeldekortReducer,
    historiskeMeldekort: historiskeMeldekortReducer,
    innsending: innsendingReducer,
    meldeform: meldeformReducer,
    ui: uiReducer,
});

const rootReducer = (state: any, action: any) => {
    console.log('INNI ROOT REDUCER!');
    console.log(action);
    if (action.type === MeldekortActions.apiKallFeilet) {
        const axiosResponse: AxiosResponse | undefined = action.payload.response;
        console.log('INNI ROOTREDUCER OG API_KALL_FEILET!');
        console.log(action);
        console.log(axiosResponse);
        if
        (
            axiosResponse &&
            axiosResponse.status !== undefined &&
            axiosResponse.status === 401
        ) {
            console.log('SLETTER ALLE DATA!');
            state = undefined;
            storage.removeItem('persist:meldekort:undefined');
        }

    }
    return appReducer(state, action);
};

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
let middleware: any[] = [routerMiddleware(history), epicMiddleware];
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: `meldekort:${packageConfig.redux_version}`,
    storage,
    // Hvis du ønsker at noe ikke skal persistes, legg det i blacklist.
    blacklist: ['locales', 'ui'],
    stateReconciler: autoMergeLevel1
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