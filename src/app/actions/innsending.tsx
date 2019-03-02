import { Constants } from '../types/innsending';
import { action, ActionType } from 'typesafe-actions';
import { KortStatus, Sporsmal } from '../types/meldekort';

export function oppdaterSvar(sporsmal: Sporsmal) {
    return action (Constants.LEGG_TIL_SVAR, {sporsmal})
}

export function settMeldekortInfo(meldekortId: number, kortStatus: KortStatus) {
    return action (Constants.SETT_MELDEKORTINFO, {meldekortId, kortStatus})
}

export type InnsendingActions = ActionType<typeof oppdaterSvar>
    & ActionType<typeof settMeldekortInfo>;