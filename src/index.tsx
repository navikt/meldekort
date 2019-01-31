import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.less';
import addLocaleData = ReactIntl.addLocaleData;
import App from './app/app';
import enLocaleData from 'react-intl/locale-data/en';
import noLocaleData from 'react-intl/locale-data/no';
import registerServiceWorker from './registerServiceWorker';
import { IntlProvider } from 'react-intl-redux';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';

addLocaleData([...noLocaleData, ...enLocaleData]);

const rootElement = document.getElementById('root');

const render = (Component: React.ComponentType<{}>) => {
    ReactDOM.render(
        <Provider store={store}>
            <IntlProvider defaultLocale="no">
            <Component />
            </IntlProvider>
        </Provider>,
        rootElement
    );
};

render(App);

registerServiceWorker();
