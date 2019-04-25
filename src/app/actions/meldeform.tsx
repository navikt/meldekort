import { ActionType, createAsyncAction, createStandardAction } from 'typesafe-actions';
import { MeldeformDetaljerInn, Meldeperiode } from '../types/person';
import { AxiosError } from 'axios';

export enum MeldeformTypeKeys {
    SETT_MELDEFORM = 'SETT_MELDEFORM',
    ENDRE_MELDEFORM = 'ENDRE_MELDEFORM',
    ENDRE_MELDEFORM_OK = 'ENDRE_MELDEFORM_OK',
    ENDRE_MELDEFORM_FEILET = 'ENDRE_MELDEFORM_FEILET',
}

export const MeldeformActions = {
    settMeldeform: createStandardAction(MeldeformTypeKeys.SETT_MELDEFORM)<MeldeformDetaljerInn>(),
    endreMeldeform: createAsyncAction(
        MeldeformTypeKeys.ENDRE_MELDEFORM,
        MeldeformTypeKeys.ENDRE_MELDEFORM_OK,
        MeldeformTypeKeys.ENDRE_MELDEFORM_FEILET
    )<MeldeformDetaljerInn, Meldeperiode, AxiosError>()
};

export type MeldeformActionTypes = ActionType<typeof MeldeformActions>;