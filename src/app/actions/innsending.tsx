import { Constants } from '../types/innsending';
import { action, ActionType } from 'typesafe-actions';
import { Sporsmal } from '../types/meldekort';

export function oppdaterSvar(sporsmal: Sporsmal) {
    return action (Constants.LEGG_TIL_SVAR, {sporsmal})
}

export function settMeldekortId(meldekortId: number) {
    return action (Constants.SETT_MELDEKORTID, {meldekortId})
}

export type InnsendingActions = ActionType<typeof oppdaterSvar>
    & ActionType<typeof settMeldekortId>;