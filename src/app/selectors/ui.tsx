import { RootState } from '../store/configureStore';
import { IModal } from '../types/ui';

export const selectModal = (state: RootState): IModal => {
    return state.ui.modal;
};