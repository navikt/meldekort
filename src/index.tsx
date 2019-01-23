import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import configureStore from './app/store/configureStore';

const render = () => {
    ReactDOM.render(
        <Provider store={configureStore}><App /></Provider>,
        document.getElementById('root') as HTMLElement
    );
};

render();

registerServiceWorker();
