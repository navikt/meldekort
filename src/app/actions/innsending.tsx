import {
  Begrunnelse,
  Innsendingstyper,
  InnsendingTypeKeys,
} from '../types/innsending';
import {
  ActionType,
  createAsyncAction,
  createStandardAction,
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

  leggTilMeldekortId: createStandardAction(
    InnsendingTypeKeys.LEGG_TIL_MELDEKORTID
  )<number>(),
  leggTilInnsendingstype: createStandardAction(
    InnsendingTypeKeys.LEGG_TIL_INNSENDINGSTYPE
  )<Innsendingstyper | null>(),

  oppdaterUtfylteDager: createStandardAction(InnsendingTypeKeys.OPPDATER_DAGER)<
    UtfyltDag[]
  >(),
  oppdaterSpm: createStandardAction(InnsendingTypeKeys.OPPDATER_SPM)<Spm[]>(),
  oppdaterMeldekortdetaljer: createStandardAction(
    InnsendingTypeKeys.OPPDATER_MELDEKORTDETALJER
  )<Meldekortdetaljer>(),

  resetInnsending: createStandardAction(InnsendingTypeKeys.RESET_INNSENDING)<
    void
  >(),
  resetSporsmalOgUtfylling: createStandardAction(
    InnsendingTypeKeys.RESET_SPORSMAL_OG_UTFYLLING
  )<void>(),

  settBegrunnelse: createStandardAction(InnsendingTypeKeys.SETT_BEGRUNNELSE)<
    Begrunnelse
  >(),
  settMeldekortdetaljerInnsending: createStandardAction(
    InnsendingTypeKeys.SETT_MELDEKORTDETALJER_INNSENDING
  )<MeldekortdetaljerInnsending>(),
  settValideringsresultat: createStandardAction(
    InnsendingTypeKeys.SETT_VALIDERINGSRESULTAT
  )<ValideringsResultat>(),
  resetValideringsresultat: createStandardAction(
    InnsendingTypeKeys.RESET_VALIDERINGSRESULTAT
  )<void>(),
};

export type InnsendingActionsTypes = ActionType<typeof InnsendingActions>;
