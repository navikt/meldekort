import { Constants } from '../types/innsending';
import { action, ActionType } from 'typesafe-actions';
import { KortStatus, Sporsmal } from '../types/meldekort';
import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';

export function oppdaterSvar(sporsmal: Sporsmal) {
    console.log('action "oppdaterSvar": ', sporsmal);
    return action (Constants.LEGG_TIL_SVAR, {sporsmal})
}

export function settMeldekortInfo(meldekortId: number, kortStatus: KortStatus) {
    return action (Constants.SETT_MELDEKORTINFO, {meldekortId, kortStatus})
}

export function oppdaterSpm(sporsmalsobjekter: Spm[]) {
    return action (Constants.OPPDATER_SPM, {sporsmalsobjekter})
}

export type InnsendingActions = ActionType<typeof oppdaterSvar>
    & ActionType<typeof settMeldekortInfo>
    & ActionType<typeof oppdaterSpm>;