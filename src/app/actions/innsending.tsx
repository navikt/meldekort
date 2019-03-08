import { Constants } from '../types/innsending';
import { action, ActionType } from 'typesafe-actions';
import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';

export function oppdaterSpm(sporsmalsobjekter: Spm[]) {
    return action (Constants.OPPDATER_SPM, {sporsmalsobjekter});
}

export function oppdaterUtfylteDager(utfylteDager: UtfyltDag[]) {
    return action (Constants.OPPDATER_DAGER, {utfylteDager});
}

export type InnsendingActions =
    ActionType<typeof oppdaterSpm> &
    ActionType<typeof oppdaterUtfylteDager>;