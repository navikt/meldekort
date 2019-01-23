import { RouterState } from 'connected-react-router';
import { RootState } from '../store/configureStore';

export const selectRouter = (state: RootState): RouterState => {
    return state.router;
}