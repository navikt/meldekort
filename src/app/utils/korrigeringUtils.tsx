import { MeldekortDag, Meldekortdetaljer, Sporsmal } from '../types/meldekort';
import { UtfyltDag } from '../sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig';
import { hentNorskeUkedager } from './ukedager';
import { Sporsmal as Spm } from '../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { InnsendingState } from '../types/innsending';

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
  const ukedagerSomListe = hentNorskeUkedager();
  return utfylteDager.map((utfyltDag, index) => {
    return {
      ...utfyltDag,
      uke: index < 7 ? 1 : 2,
      dag: ukedagerSomListe[index % 7].trim(),
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
