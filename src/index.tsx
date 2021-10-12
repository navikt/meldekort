import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.less';
import App from './app/app';
import * as serviceWorker from './registerServiceWorker';
import { IntlProvider, updateIntl } from 'react-intl-redux';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { messagesLoader } from './app/reducers/localesReducer';
import { Konstanter } from './app/utils/consts';
import { addLocaleData } from 'react-intl';

let locales = store.getState().locales;
Object.keys(store.getState().locales).forEach(sprakObj =>
  addLocaleData(locales[sprakObj].localeData)
);

const rootElement = document.getElementById('meldekort__root');

const render = (Component: React.ComponentType, locale: string) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div />}>
        <IntlProvider locale={locale} defaultLocale={locale}>
          <Component />
        </IntlProvider>
      </PersistGate>
    </Provider>,
    rootElement
  );
};

// TODO: render a loader before getting messages
messagesLoader[Konstanter().defaultLocale]().then((messages: object) => {
  store.dispatch(
    updateIntl({ locale: Konstanter().defaultLocale, messages: messages })
  );

  return render(App, Konstanter().defaultLocale);
});

serviceWorker.unregister();
