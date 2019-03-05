import { ActionType, createStandardAction } from 'typesafe-actions';
import { BaksystemFeilmelding, IModal } from '../types/ui';

export enum UiTypeKeys {
    SKJUL_MODAL = 'SKJUL_MODAL',
    VIS_MODAL = 'VIS_MODAL',
    SKJUL_BAKSYSTEM_FEILMELDING = 'SKJUL_BAKSYSTEM_FEILMELDING',
    VIS_BAKSYSTEM_FEILMELDING = 'VIS_BEKSYSTEM_FEILMELDING',
}

export const UiActions = {
    skjulModal: createStandardAction(UiTypeKeys.SKJUL_MODAL)<void>(),
    visModal: createStandardAction(UiTypeKeys.VIS_MODAL)<IModal>(),
    skjulBaksystemFeilmelding: createStandardAction(UiTypeKeys.SKJUL_BAKSYSTEM_FEILMELDING)<void>(),
    visBaksystemFeilmelding: createStandardAction(UiTypeKeys.VIS_BAKSYSTEM_FEILMELDING)<BaksystemFeilmelding>()
};
export type UiActionTypes = ActionType<typeof UiActions>;