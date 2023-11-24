import { Meldekort } from "../types/meldekort";
import { ActionType, createAction } from "typesafe-actions";

export enum AktivtMeldekortTypeKeys {
  LEGG_TIL_AKTIVT_MELDEKORT = "LEGG_TIL_AKTIVT_MELDEKORT",
  RESETT_AKTIVT_MELDEKORT = "RESETT_AKTIVT_MELDEKORT"
}

export const AktivtMeldekortActions = {
  oppdaterAktivtMeldekort: createAction(
    AktivtMeldekortTypeKeys.LEGG_TIL_AKTIVT_MELDEKORT
  )<Meldekort>(),
  resettAktivtMeldekort: createAction(
    AktivtMeldekortTypeKeys.RESETT_AKTIVT_MELDEKORT
  )<void>()
};

export type AktivtMeldekortActionsTypes = ActionType<
  typeof AktivtMeldekortActions
>;
