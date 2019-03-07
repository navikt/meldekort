import { Constants } from '../types/innsending';
import { action, ActionType } from 'typesafe-actions';
import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';

export function oppdaterSpm(sporsmalsobjekter: Spm[]) {
    return action (Constants.OPPDATER_SPM, {sporsmalsobjekter})
}
export function leggTilMeldekortId(meldekortId: number) {
    return action (Constants.LEGG_TIL_MELDEKORTID, {meldekortId})
}

export type InnsendingActions = ActionType<typeof oppdaterSpm> &
    ActionType<typeof leggTilMeldekortId>;