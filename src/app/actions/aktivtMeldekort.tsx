import { Constants } from '../types/meldekort';
import { action, ActionType } from 'typesafe-actions';

export function oppdaterAktivtMeldekort(meldekortId: number) {
    return action(Constants.LEGG_TIL_AKTIVT_MELDEKORT, {
        meldekortId
    });
}

export type AktivtMeldekortActions = ActionType<typeof oppdaterAktivtMeldekort>;