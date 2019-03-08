import { Constants, Innsendingstyper } from '../types/innsending';
import { action, ActionType } from 'typesafe-actions';
import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';

export function oppdaterSpm(sporsmalsobjekter: Spm[]) {
    return action (Constants.OPPDATER_SPM, {sporsmalsobjekter})
}
export function leggTilMeldekortId(meldekortId: number) {
    return action (Constants.LEGG_TIL_MELDEKORTID, {meldekortId})
}
export function leggTilInnsendingstype(innsendingstype: Innsendingstyper) {
    return action (Constants.LEGG_TIL_INNSENDINGSTYPE, {innsendingstype})
}

export type InnsendingActions = ActionType<typeof oppdaterSpm> &
    ActionType<typeof leggTilMeldekortId>&
    ActionType<typeof leggTilInnsendingstype>;