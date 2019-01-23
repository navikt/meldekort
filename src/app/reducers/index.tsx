import { combineReducers } from 'redux';
import { History } from 'history';
import { RouterState, connectRouter } from 'connected-react-router';
import { demoReducer } from './demoReducer';
import { DemoState } from '../types/demo';

const rootReducer = (history: History) => combineReducers({
    demo: demoReducer,
    router: connectRouter(history)
});

export interface State {
    demo: DemoState;
    router: RouterState;
}

export default rootReducer;
