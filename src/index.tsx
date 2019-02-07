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
import { store } from './app/store/configureStore';

addLocaleData([...nbLocaleData, ...enLocaleData]);

const rootElement = document.getElementById('root');

const render = (Component: React.ComponentType<{}>) => {
    ReactDOM.render(
        <Provider store={store}>
            <IntlProvider locale="nb" defaultLocale="nb">
            <Component />
            </IntlProvider>
        </Provider>,
        rootElement
    );
};

render(App);

serviceWorker.unregister();
