import storage from 'redux-persist/lib/storage/session';

import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { persistReducer, persistStore } from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';

import aktivtMeldekortReducer from '../reducers/aktivtMeldekortReducer';
import historiskeMeldekortReducer, {
  HistoriskeMeldekortState,
} from '../reducers/historiskeMeldekortReducer';
import meldekortdetaljerReducer, {
  MeldekortdetaljerState,
} from '../reducers/meldekortdetaljerReducer';
import personReducer from '../reducers/personReducer';
import personStatusReducer, {
  PersonStatusState,
} from '../reducers/personStatusReducer';
import { default as localesReducer, Locales } from '../reducers/localesReducer';
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
import personInfoReducer, {
  PersonInfoState,
} from '../reducers/personInfoReducer';
import personInfoEpics from '../epics/personInfoEpics';
import { hentEnvSetting } from '../utils/env';
import { WeblogicPing } from '../types/weblogic';
import weblogicReducer from '../reducers/weblogicReducer';
import weblogicEpics from '../epics/weblogicEpics';
import { Konstanter } from '../utils/consts';

export const history = createBrowserHistory({
  basename: Konstanter().basePath,
});

const packageConfig = require('../../../package.json');

const initialState = {};

export interface RootState {
  locales: Locales;
  intl: IntlState;
  router: RouterState;
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
  weblogic: WeblogicPing;
}

export type AppEpic = Epic<Action, Action, RootState>;

const appReducer = combineReducers({
  locales: localesReducer,
  intl: intlReducer,
  router: connectRouter(history),
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
  weblogic: weblogicReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === MeldekortTypeKeys.API_KALL_FEILET) {
    if (
      action.payload.response &&
      action.payload.response.status !== undefined &&
      action.payload.response.status === 401
    ) {
      const { intl } = state;
      state = { intl };
      storage.removeItem('persist:meldekort:undefined');
    }
  }
  return appReducer(state, action);
};

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();
let middleware: any[] = [routerMiddleware(history), epicMiddleware];
const composeEnhancer: typeof compose =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const hentNokkel = (): string => {
  return btoa(hentEnvSetting('MELDEKORTSESSIONSTORAGE'));
};

const encryptor = createEncryptor({
  secretKey: hentNokkel(),
  onError: function(error: any) {
    console.log('Det skjedde en feil med kryptering!', error);
    storage.removeItem('persist:meldekort:undefined');
  },
});

const persistConfig = {
  key: `meldekort:${packageConfig.redux_version}`,
  storage,
  // Hvis du ønsker at noe ikke skal persistes, legg det i blacklist.
  blacklist: ['locales', 'ui', 'personInfo'],
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const appliedMiddleware = applyMiddleware(
  ...middleware,
  routerMiddleware(history)
);

const store = createStore(
  persistedReducer,
  initialState as any,
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
    weblogicEpics
  )
);

export { store, persistor };
