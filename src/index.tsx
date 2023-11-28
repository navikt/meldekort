import * as React from "react";
import { FunctionComponent, FunctionComponentElement, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import App from "./app/app";
import * as serviceWorker from "./registerServiceWorker";
import { IntlProvider, updateIntl } from "react-intl-redux";
import { Provider, ProviderProps } from "react-redux";
import { persistor, store } from "./app/store/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { Konstanter } from "./app/utils/consts";
import { downloadMessages } from "./app/utils/intlUtil";
import { erViggo } from "./app/utils/viggoUtils";

import "nav-frontend-core/dist/main.css";
import "nav-frontend-ekspanderbartpanel-style/dist/main.css";
import "nav-frontend-lukknapp-style/dist/main.css";
import "nav-frontend-paneler-style/dist/main.css";
import "nav-frontend-typografi-style/dist/main.css";
import "./index.css";
import "@navikt/ds-css";
import { Loader } from "@navikt/ds-react";

const rootElement = document.getElementById("meldekort__root");

const render = (element: FunctionComponentElement<ProviderProps>) => {
  ReactDOM.render(element, rootElement);
};

const renderApp = (Component: FunctionComponent, locale: string) => {
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

const renderLoader = (element: ReactElement) => {
  render(<div className="loader">{element}</div>);
};

// Først viser vi loader
renderLoader(<Loader size="xlarge" />);

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
