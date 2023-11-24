import { finnRiktigEtikettKlasse } from "../../app/utils/statusEtikettUtil";
import { KortStatus } from "../../app/types/meldekort";

it("finnRiktigEtikettKlasse", () => {
  expect(finnRiktigEtikettKlasse(KortStatus.KLAR)).toBe(
    "etikettbase__fokusert"
  );

  expect(finnRiktigEtikettKlasse(KortStatus.REGIS)).toBe(
    "etikettbase__informativ"
  );
  expect(finnRiktigEtikettKlasse(KortStatus.NYKTR)).toBe(
    "etikettbase__informativ"
  );
  expect(finnRiktigEtikettKlasse(KortStatus.UBEHA)).toBe(
    "etikettbase__informativ"
  );

  expect(finnRiktigEtikettKlasse(KortStatus.FERDI)).toBe(
    "etikettbase__positiv"
  );
  expect(finnRiktigEtikettKlasse(KortStatus.IKKE)).toBe("etikettbase__positiv");
  expect(finnRiktigEtikettKlasse(KortStatus.OVERM)).toBe(
    "etikettbase__positiv"
  );

  expect(finnRiktigEtikettKlasse(KortStatus.FEIL)).toBe(
    "etikettbase__fremhevet"
  );
  expect(finnRiktigEtikettKlasse(KortStatus.VENTE)).toBe(
    "etikettbase__fremhevet"
  );
  expect(finnRiktigEtikettKlasse(KortStatus.FMOPP)).toBe(
    "etikettbase__fremhevet"
  );
  expect(finnRiktigEtikettKlasse(KortStatus.FUOPP)).toBe(
    "etikettbase__fremhevet"
  );
});
