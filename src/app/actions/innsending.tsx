import {
  Begrunnelse,
  Innsendingstyper,
  InnsendingTypeKeys,
} from '../types/innsending';
import {
  ActionType,
  createAsyncAction,
  createAction,
} from 'typesafe-actions';
import { Sporsmal as Spm } from '../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { AxiosError } from 'axios';
import { UtfyltDag } from '../sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig';
import {
  Meldekortdetaljer,
  MeldekortdetaljerInnsending,
  ValideringsResultat,
} from '../types/meldekort';

export const InnsendingActions = {
  hentKorrigertId: createAsyncAction(
    InnsendingTypeKeys.HENT_KORRIGERTID,
    InnsendingTypeKeys.HENT_KORRIGERTID_OK,
    InnsendingTypeKeys.HENT_KORRIGERTID_FEILET
  )<void, number, AxiosError>(),

  kontrollerMeldekort: createAsyncAction(
    InnsendingTypeKeys.KONTROLLER_MELDEKORT,
    InnsendingTypeKeys.KONTROLLER_MELDEKORT_OK,
    InnsendingTypeKeys.KONTROLLER_MELDEKORT_FEILET
  )<MeldekortdetaljerInnsending, ValideringsResultat, AxiosError>(),

  leggTilMeldekortId: createAction(
    InnsendingTypeKeys.LEGG_TIL_MELDEKORTID
  )<number>(),
  leggTilInnsendingstype: createAction(
    InnsendingTypeKeys.LEGG_TIL_INNSENDINGSTYPE
  )<Innsendingstyper | null>(),

  oppdaterUtfylteDager: createAction(InnsendingTypeKeys.OPPDATER_DAGER)<
    UtfyltDag[]
  >(),
  oppdaterSpm: createAction(InnsendingTypeKeys.OPPDATER_SPM)<Spm[]>(),
  oppdaterMeldekortdetaljer: createAction(
    InnsendingTypeKeys.OPPDATER_MELDEKORTDETALJER
  )<Meldekortdetaljer>(),

  resetInnsending: createAction(InnsendingTypeKeys.RESET_INNSENDING)<
    void
  >(),
  resetSporsmalOgUtfylling: createAction(
    InnsendingTypeKeys.RESET_SPORSMAL_OG_UTFYLLING
  )<void>(),

  settBegrunnelse: createAction(InnsendingTypeKeys.SETT_BEGRUNNELSE)<
    Begrunnelse
  >(),
  settMeldekortdetaljerInnsending: createAction(
    InnsendingTypeKeys.SETT_MELDEKORTDETALJER_INNSENDING
  )<MeldekortdetaljerInnsending>(),
  settValideringsresultat: createAction(
    InnsendingTypeKeys.SETT_VALIDERINGSRESULTAT
  )<ValideringsResultat>(),
  resetValideringsresultat: createAction(
    InnsendingTypeKeys.RESET_VALIDERINGSRESULTAT
  )<void>(),
};

export type InnsendingActionsTypes = ActionType<typeof InnsendingActions>;
