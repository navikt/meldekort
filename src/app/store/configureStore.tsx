import storage from 'redux-persist/lib/storage/session';

import { Action, applyMiddleware, combineReducers, compose, createStore, Middleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import aktivtMeldekortReducer from '../reducers/aktivtMeldekortReducer';
import historiskeMeldekortReducer, { HistoriskeMeldekortState } from '../reducers/historiskeMeldekortReducer';
import meldekortdetaljerReducer, { MeldekortdetaljerState } from '../reducers/meldekortdetaljerReducer';
import personReducer from '../reducers/personReducer';
import personStatusReducer, { PersonStatusState } from '../reducers/personStatusReducer';
import { default as localesReducer, Locale } from '../reducers/localesReducer';
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
import { MeldekortTypeKeys } from '../actions/meldekort';
import meldekortReducer from '../reducers/meldekortReducer';
import { Meldekort, MeldekortState } from '../types/meldekort';
import personInfoReducer, { PersonInfoState } from '../reducers/personInfoReducer';
import personInfoEpics from '../epics/personInfoEpics';
import { hentEnvSetting } from '../utils/env';
import { Skrivemodus } from '../types/skrivemodus';
import skrivemodusReducer from '../reducers/skrivemodusReducer';
import skrivemodusEpics from '../epics/skrivemodusEpics';
import packageConfig from '../../../package.json';

const initialState = {};

export interface RootState {
  locales: Locale[];
  intl: IntlState;
  person: Person;
  personStatus: PersonStatusState;
  personInfo: PersonInfoState;
  meldekortdetaljer: MeldekortdetaljerState;
  aktivtMeldekort: Meldekort;
  historiskeMeldekort: HistoriskeMeldekortState;
  innsending: InnsendingState;
  meny: MenyState;
  ui: UIState;
  meldekort: MeldekortState;
  skrivemodus: Skrivemodus;
}

export type AppEpic = Epic<Action, Action, RootState>;

const appReducer = combineReducers({
  locales: localesReducer,
  intl: intlReducer,
  person: personReducer,
  personStatus: personStatusReducer,
  personInfo: personInfoReducer,
  meldekortdetaljer: meldekortdetaljerReducer,
  aktivtMeldekort: aktivtMeldekortReducer,
  historiskeMeldekort: historiskeMeldekortReducer,
  innsending: innsendingReducer,
  meny: menyReducer,
  ui: uiReducer,
  meldekort: meldekortReducer,
  skrivemodus: skrivemodusReducer,
});

// PayloadAction<MeldekortTypeKeys.API_KALL_FEILET, AxiosError>
/* eslint-disable @typescript-eslint/no-explicit-any */
const rootReducer = (state: RootState, action: any ) => {
  if (action.type === MeldekortTypeKeys.API_KALL_FEILET) {
    if (
      action.payload.response &&
      action.payload.response.status !== undefined &&
      action.payload.response.status === 401
    ) {
      storage.removeItem('persist:meldekort:undefined');
    }
  }
  return appReducer(state, action);
};

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
const middleware: Middleware[] = [epicMiddleware];
const composeEnhancer: typeof compose =
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose
    : compose;

const hentNokkel = (): string => {
  return btoa(hentEnvSetting('MELDEKORTSESSIONSTORAGE'));
};

const encryptor = encryptTransform({
  secretKey: hentNokkel(),
  onError: function(error: Error) {
    console.log('Det skjedde en feil med kryptering!', error);
    storage.removeItem('persist:meldekort:undefined');
  },
});

const persistConfig = {
  // TODO: Why do we need redux_version?
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  key: `meldekort:${packageConfig.redux_version}`,
  storage,
  // Hvis du ønsker at noe ikke skal persistes, legg det i blacklist.
  blacklist: ['locales', 'ui', 'personInfo'],
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const appliedMiddleware = applyMiddleware(
  ...middleware
);

const store = createStore(
  persistedReducer,
  initialState,
  composeEnhancer(appliedMiddleware)
);

const persistor = persistStore(store);

epicMiddleware.run(
  combineEpics(
    personEpics,
    personStatusEpics,
    personInfoEpics,
    historiskeMeldekortEpics,
    innsendingEpics,
    meldekortdetaljerEpics,
    meldekortEpics,
    skrivemodusEpics
  )
);

export { store, persistor };
