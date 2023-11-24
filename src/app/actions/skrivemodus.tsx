import { ActionType, createAsyncAction } from "typesafe-actions";
import { Skrivemodus } from "../types/skrivemodus";
import { AxiosError } from "axios";

export enum SkrivemodusTypeKeys {
  SKRIVEMODUS = "SKRIVEMODUS",
  SKRIVEMODUS_OK = "SKRIVEMODUS_OK",
  SKRIVEMODUS_FEILET = "SKRIVEMODUS_FEILET"
}

export const SkrivemodusActions = {
  hentSkrivemodus: createAsyncAction(
    SkrivemodusTypeKeys.SKRIVEMODUS,
    SkrivemodusTypeKeys.SKRIVEMODUS_OK,
    SkrivemodusTypeKeys.SKRIVEMODUS_FEILET
  )<void, Skrivemodus, AxiosError>()
};

export type SkrivemodusActionTypes = ActionType<typeof SkrivemodusActions>;
