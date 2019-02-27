import { Constants, Meldekort } from '../types/meldekort';
import { action, ActionType } from 'typesafe-actions';

export function oppdaterAktivtMeldekort(meldekort: Meldekort) {
    return action(Constants.LEGG_TIL_AKTIVT_MELDEKORT, {
        meldekort
    });
}

export type AktivtMeldekortActions = ActionType<typeof oppdaterAktivtMeldekort>;