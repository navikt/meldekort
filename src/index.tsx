import './polyfill.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.less';
import nbLocaleData from 'react-intl/locale-data/nb';
import enLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';
import App from './app/app';
import * as serviceWorker from './registerServiceWorker';
import { IntlProvider } from 'react-intl-redux';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';

addLocaleData([...nbLocaleData, ...enLocaleData]);

const rootElement = document.getElementById('meldekort-root');

const render = (Component: React.ComponentType<{}>) => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<div />}>
                <IntlProvider locale="nb" defaultLocale="nb">
                    <Component />
                </IntlProvider>
            </PersistGate>
        </Provider>,
        rootElement
    );
};

render(App);

serviceWorker.unregister();
