import { ActionType, createAction, createAsyncAction } from "typesafe-actions";
import { AxiosError } from "axios";
import { Meldekortdetaljer } from "../types/meldekort";

export enum MeldekortdetaljerTypeKeys {
  HENT_MELDEKORTDETALJER = "HENT_MELDEKORTDETALJER",
  HENT_MELDEKORTDETALJER_OK = "HENT_MELDEKORTDETALJER_OK",
  HENT_MELDEKORTDETALJER_FEILET = "HENT_MELDEKORTDETALJER_FEILET",
  RESETT_MELDEKORTDETALJER = "RESETT_MELDEKORTDETALJER"
}

export const MeldekortdetaljerActions = {
  hentMeldekortdetaljer: createAsyncAction(
    MeldekortdetaljerTypeKeys.HENT_MELDEKORTDETALJER,
    MeldekortdetaljerTypeKeys.HENT_MELDEKORTDETALJER_OK,
    MeldekortdetaljerTypeKeys.HENT_MELDEKORTDETALJER_FEILET
  )<void, Meldekortdetaljer, AxiosError>(),
  resettMeldekortdetaljer: createAction(
    MeldekortdetaljerTypeKeys.RESETT_MELDEKORTDETALJER
  )<void>()
};

export type MeldekortdetaljerActionTypes = ActionType<
  typeof MeldekortdetaljerActions
>;
