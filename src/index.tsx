import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';

const rootElement = document.getElementById('root');

const render = (Component: React.ComponentType<{}>) => {
    ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>,
        rootElement
    );
};

render(App);

registerServiceWorker();
