import { RootState } from '../store/configureStore';
import { BaksystemFeilmelding, IModal } from '../types/ui';

export const selectModal = (state: RootState): IModal => {
    return state.ui.modal;
};

export const selectFeilmelding = (state: RootState): BaksystemFeilmelding => {
    return state.ui.baksystemFeilmelding;
};