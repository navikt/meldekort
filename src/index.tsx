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
import { Locales } from './app/reducers/localesReducer';
import { Konstanter } from './app/utils/consts';
import { addLocaleData } from 'react-intl';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { FunctionComponentElement } from 'react';
import { downloadMessages } from './app/utils/intlUtil';

let locales: Locales = store.getState().locales;
locales.forEach(locale => addLocaleData(locale.localeData));

const rootElement = document.getElementById('meldekort__root');

const render = (element: FunctionComponentElement<any>) => {
  ReactDOM.render(element, rootElement);
};

const renderApp = (Component: React.ComponentType, locale: string) => {
  render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div />}>
        <IntlProvider locale={locale} defaultLocale={locale}>
          <Component />
        </IntlProvider>
      </PersistGate>
    </Provider>
  );
};

const renderLoader = (element: any) => {
  render(<div className="loader">{element}</div>);
};

// Først viser vi loader
renderLoader(<NavFrontendSpinner type="XL" />);

// Nå kan vi prøve å hente tekster
// Det er ikke noe vits i å vise appen uten tekstene
// Hvis vi kan hente tekstene, viser vi appen
// Hvis vi ikke kan hente tekstene, viser vi feilmelding
downloadMessages(Konstanter.defaultLocale, Konstanter.defaultFromDate)
  .then((messages: object) => {
    store.dispatch(
      updateIntl({ locale: Konstanter.defaultLocale, messages: messages })
    );

    return renderApp(App, Konstanter.defaultLocale);
  })
  .catch(reason => {
    return renderLoader(<div>{reason}</div>);
  });

serviceWorker.unregister();
