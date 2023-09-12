import 'babel-polyfill';
import * as React from 'react';
import { FunctionComponentElement } from 'react';
import * as ReactDOM from 'react-dom';
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
import { downloadMessages } from './app/utils/intlUtil';

import 'nav-frontend-core/dist/main.css';
import 'nav-frontend-alertstriper-style/dist/main.css';
import 'nav-frontend-chevron-style/dist/main.css';
import 'nav-frontend-ekspanderbartpanel-style/dist/main.css';
import 'nav-frontend-etiketter-style/dist/main.css';
import 'nav-frontend-knapper-style/dist/main.css';
import 'nav-frontend-lenker-style/dist/main.css';
import 'nav-frontend-lukknapp-style/dist/main.css';
import 'nav-frontend-modal-style/dist/main.css';
import 'nav-frontend-paneler-style/dist/main.css';
import 'nav-frontend-skjema-style/dist/main.css';
import 'nav-frontend-spinner-style/dist/main.css';
import 'nav-frontend-stegindikator-style/dist/main.css';
import 'nav-frontend-typografi-style/dist/main.css';
import 'nav-frontend-veileder-style/dist/main.css';
import 'nav-frontend-veilederpanel-style/dist/main.css';
import './index.css';
import { erViggo } from './app/utils/viggoUtils';

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
        <IntlProvider
          locale={locale}
          defaultLocale={locale}
          messages={store.getState().intl.messages}
        >
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

// Sjekk at denne personen skal sendes til den nye løsningen
erViggo();

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
