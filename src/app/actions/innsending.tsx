import { Constants } from '../types/innsending';
import { action, ActionType, createAsyncAction } from 'typesafe-actions';
import { Sporsmal as Spm } from '../pages/innsending/sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../pages/innsending/utfyllingsside/utfylling/utfyllingConfig';
import { Meldekortdetaljer, MeldekortdetaljerInnsending, ValideringsResultat } from '../types/meldekort';
import { AxiosError } from 'axios';

export function oppdaterSpm(sporsmalsobjekter: Spm[]) {
    return action (Constants.OPPDATER_SPM, {sporsmalsobjekter});
}

export function oppdaterUtfylteDager(utfylteDager: UtfyltDag[]) {
    return action (Constants.OPPDATER_DAGER, {utfylteDager});
}

export function oppdaterMeldekortdetaljer(meldekortdetaljer: Meldekortdetaljer) {
    return action (Constants.OPPDATER_MELDEKORTDETALJER, {meldekortdetaljer});
}

export function setMeldekortdetaljerInnsending(meldekortdetaljerInnsending: MeldekortdetaljerInnsending) {
    return action (Constants.SETT_MELDEKORTDETALJER_INNSEDNING, {meldekortdetaljerInnsending});
}

export function setValideringsresultat(valideringsresultat: ValideringsResultat) {
    return action (Constants.SETT_VALIDERINGSRESULTAT, {valideringsresultat});
}

export const KontrollerActions = {
    kontrollerMeldekort: createAsyncAction(
        Constants.KONTROLLER_MELDEKORT,
        Constants.KONTROLLER_MELDEKORT_OK,
        Constants.KONTROLLER_MELDEKORT_FEILET
    )<MeldekortdetaljerInnsending, ValideringsResultat, AxiosError>()
};

export type KontrollerActionTypes = ActionType<typeof KontrollerActions>;

export type InnsendingActions =
    ActionType<typeof oppdaterSpm> &
    ActionType<typeof oppdaterUtfylteDager> &
    ActionType<typeof setMeldekortdetaljerInnsending> &
    ActionType<typeof setValideringsresultat>;