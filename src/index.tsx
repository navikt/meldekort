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
import { downloadMessages, Locales } from './app/reducers/localesReducer';
import { Konstanter } from './app/utils/consts';
import { addLocaleData } from 'react-intl';

let locales: Locales = store.getState().locales;
locales.forEach(locale => addLocaleData(locale.localeData));

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

downloadMessages(Konstanter().defaultLocale, Konstanter().defaultFromTime).then(
  (messages: object) => {
    store.dispatch(
      updateIntl({ locale: Konstanter().defaultLocale, messages: messages })
    );

    return render(App, Konstanter().defaultLocale);
  }
);

serviceWorker.unregister();
