import {
  ActionType,
  createAsyncAction,
  createAction,
} from 'typesafe-actions';
import { AxiosError } from 'axios';
import { Infomelding, SendtMeldekort } from '../types/meldekort';

export enum MeldekortTypeKeys {
  API_KALL_FEILET = 'API_KALL_FEILET',
  LEGG_TIL_INNSENDT_MELDEKORT = 'LEGG_TIL_INNSENDT_MELDEKORT',
  HENT_INFOMELDING = 'HENT_INFOMELDING',
  HENT_INFOMELDING_OK = 'HENT_INFOMELDING_OK',
  HENT_INFOMELDING_FEILET = 'HENT_INFOMELDING_FEILET',
}

export const MeldekortActions = {
  apiKallFeilet: createAction(MeldekortTypeKeys.API_KALL_FEILET)<AxiosError>(),
  leggTilInnsendtMeldekort: createAction(MeldekortTypeKeys.LEGG_TIL_INNSENDT_MELDEKORT)<SendtMeldekort[]>(),
  hentInfomelding: createAsyncAction(
    MeldekortTypeKeys.HENT_INFOMELDING,
    MeldekortTypeKeys.HENT_INFOMELDING_OK,
    MeldekortTypeKeys.HENT_INFOMELDING_FEILET
  )<void, Infomelding, AxiosError>(),
};

export type MeldekortActionTypes = ActionType<typeof MeldekortActions>;
