import { BaksystemFeilmelding, IModal } from '../types/ui';
import { UiActions, UiActionTypes } from '../actions/ui';
import { getType } from 'typesafe-actions';
import { loggInnContent } from '../components/modal/loggInnContent';
import { baksystemFeilmeldingContent } from '../components/feil/baksystemFeilmeldingContent';

export interface UIState {
    modal: IModal;
    baksystemFeilmelding: BaksystemFeilmelding;
}

const initialState: UIState = {
    modal: {
        content: () => '',
        visModal: false,
    },
    baksystemFeilmelding: {
        content: () => baksystemFeilmeldingContent(),
        visFeilmelding: true
    }
};

const uiReducer = (state: UIState = initialState, action: UiActionTypes): UIState => {
    switch (action.type) {
        case getType(UiActions.visModal):
            return {
                ...state,
                modal: action.payload,
            };
        case getType(UiActions.skjulModal):
            return {
                ...state,
                modal: initialState.modal,
            };
        case getType(UiActions.visBaksystemFeilmelding):
            return {
                ...state,
                baksystemFeilmelding: action.payload,
            };
        case getType(UiActions.skjulBaksystemFeilmelding):
            return {
                ...state,
                baksystemFeilmelding: initialState.baksystemFeilmelding,
            };
        default:
            return state;
    }
};

export default uiReducer;