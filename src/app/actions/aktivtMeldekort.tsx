import { Meldekort } from '../types/meldekort';
import { ActionType, createStandardAction } from 'typesafe-actions';

export enum AktivtMeldekortTypeKeys {
    LEGG_TIL_AKTIVT_MELDEKORT = 'LEGG_TIL_AKTIVT_MELDEKORT'
}

export const AktivtMeldekortActions = {
    oppdaterAktivtMeldekort: createStandardAction(AktivtMeldekortTypeKeys.LEGG_TIL_AKTIVT_MELDEKORT)<Meldekort>(),
};

export type AktivtMeldekortActionsTypes = ActionType<typeof AktivtMeldekortActions>;