import { MeldekortDag, Meldekortdetaljer, Sporsmal } from '../types/meldekort';
import { UtfyltDag } from '../sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig';
import { Sporsmal as Spm } from '../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { InnsendingState } from '../types/innsending';
import { store } from '../store/configureStore';
import { UiActions } from '../actions/ui';
import { InnsendingActions } from '../actions/innsending';
import { fetchKorrigertId } from '../api/api';

const settCheckedBasertPaBoolean = (
  kategoritekst: string,
  sporsmalValg: boolean
) => {
  return sporsmalValg ? kategoritekst + '.ja' : kategoritekst + '.nei';
};

const konverterMeldekortdetaljerMeldekortDagerTilInnsendingUtfylteDager = (
  meldekortDager: MeldekortDag[],
  utfylteDager: UtfyltDag[]
) => {
  return utfylteDager.map((utfyltDag, index) => {
    return {
      ...utfyltDag,
      syk: meldekortDager[index].syk,
      arbeidetTimer: meldekortDager[index].arbeidetTimerSum.toString(),
      annetFravaer: meldekortDager[index].annetFravaer,
      kurs: meldekortDager[index].kurs,
    };
  });
};

const returnerListeMedMeldekortdetaljerSporsmal = (
  mkdetaljerSporsmal: Sporsmal
) => {
  return [
    { kategori: 'arbeid', checked: mkdetaljerSporsmal.arbeidet },
    { kategori: 'aktivitetArbeid', checked: mkdetaljerSporsmal.kurs },
    { kategori: 'forhindret', checked: mkdetaljerSporsmal.syk },
    { kategori: 'ferieFravar', checked: mkdetaljerSporsmal.annetFravaer },
    { kategori: 'registrert', checked: mkdetaljerSporsmal.arbeidssoker },
  ];
};

const konverterMeldekortdetaljerSporsmalTilInnsendingSporsmal = (
  mkdetaljerSporsmal: Sporsmal,
  innsendingSporsmal: Spm[]
): Spm[] => {
  const listeMedSporsmal = mkdetaljerSporsmal!
    ? returnerListeMedMeldekortdetaljerSporsmal(mkdetaljerSporsmal)
    : [];
  return innsendingSporsmal.map(spm => {
    for (let i = 0; i < listeMedSporsmal.length; i++) {
      if (spm.kategori === listeMedSporsmal[i].kategori) {
        return {
          ...spm,
          checked: settCheckedBasertPaBoolean(
            spm.kategori,
            listeMedSporsmal[i].checked
          ),
        };
      }
    }
    return { ...spm };
  });
};

export function settSporsmalOgUtfyllingHvisKorrigering(
  meldekortdetaljer: Meldekortdetaljer,
  innsending: InnsendingState
) {
  const konverterteSporsmalsobjekter = konverterMeldekortdetaljerSporsmalTilInnsendingSporsmal(
    meldekortdetaljer.sporsmal,
    innsending.sporsmalsobjekter
  );
  const konverterteUtfylteDager = konverterMeldekortdetaljerMeldekortDagerTilInnsendingUtfylteDager(
    meldekortdetaljer.sporsmal.meldekortDager,
    innsending.utfylteDager
  );
  return {
    sporsmalsobjekter: konverterteSporsmalsobjekter,
    utfylteDager: konverterteUtfylteDager,
  };
}

export const hentKorrigertIdAndDispatch = () => {
  store.dispatch(UiActions.startLoading());

  fetchKorrigertId(store.getState().aktivtMeldekort.meldekortId)
    .then((payload: number) => {
      store.dispatch(InnsendingActions.hentKorrigertId.success(payload));
    })
    .catch(error => {
      console.log(error);
      store.dispatch(InnsendingActions.hentKorrigertId.failure(error));
    })
    .finally(() => {
      store.dispatch(UiActions.stopLoading());
    });
};
