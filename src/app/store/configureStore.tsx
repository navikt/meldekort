import { createBrowserHistory } from 'history';
import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { default as localesReducer, LocalesState } from '../reducers/localesReducer';

import { intlReducer, IntlState } from 'react-intl-redux';
import tekster from '../tekster/kompilerte-tekster';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';

import personReducer, { PersonState } from '../reducers/personReducer';
import historiskeMeldekortReducer, { HistoriskeMeldekortState } from '../reducers/historiskeMeldekortReducer';
import personEpics from '../epics/personEpics';
import historiskeMeldekortEpics from '../epics/historiskeMeldekortEpics';
import personStatusReducer, { PersonStatusState } from '../reducers/personStatusReducer';
import personStatusEpics from '../epics/personStatusEpics';
import meldekortdetaljerReducer, { MeldekortdetaljerState } from '../reducers/meldekortdetaljerReducer';
import meldekortdetaljerEpics from '../epics/meldekortdetaljerEpics';
import aktivtMeldekortReducer, { AktivtMeldekortState } from '../reducers/aktivtMeldekortReducer';
import uiReducer, { UIState } from '../reducers/uiReducer';
import meldekortEpics from '../epics/meldekortEpics';

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
    intl: IntlState;
    locales: LocalesState;
    router: RouterState;
    person: PersonState;
    personStatus: PersonStatusState;
    historiskeMeldekort: HistoriskeMeldekortState;
    meldekortdetaljer: MeldekortdetaljerState;
    aktivtMeldekort: AktivtMeldekortState;
    ui: UIState;
}

export type AppEpic = Epic<Action, Action, RootState>;

const rootReducer = combineReducers({
    intl: intlReducer,
    locales: localesReducer,
    router: connectRouter(history),
    person: personReducer,
    personStatus: personStatusReducer,
    historiskeMeldekort: historiskeMeldekortReducer,
    meldekortdetaljer: meldekortdetaljerReducer,
    aktivtMeldekort: aktivtMeldekortReducer,
    ui: uiReducer,
});

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
let middleware: any[] = [routerMiddleware(history), epicMiddleware];

const appliedMiddleware = applyMiddleware(...middleware, routerMiddleware(history));

const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    initialState as any,
    composeEnhancer(appliedMiddleware)
);

epicMiddleware.run(
    combineEpics(
        personEpics,
        personStatusEpics,
        historiskeMeldekortEpics,
        meldekortdetaljerEpics,
        meldekortEpics
    )
);

export { store };