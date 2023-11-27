import { finnRiktigTagVariant } from "../../app/utils/statusEtikettUtil";
import { KortStatus } from "../../app/types/meldekort";

it("finnRiktigEtikettKlasse", () => {
  expect(finnRiktigTagVariant(KortStatus.KLAR)).toBe(
    "warning"
  );

  expect(finnRiktigTagVariant(KortStatus.REGIS)).toBe(
    "info"
  );
  expect(finnRiktigTagVariant(KortStatus.NYKTR)).toBe(
    "info"
  );
  expect(finnRiktigTagVariant(KortStatus.UBEHA)).toBe(
    "info"
  );

  expect(finnRiktigTagVariant(KortStatus.FERDI)).toBe(
    "success"
  );
  expect(finnRiktigTagVariant(KortStatus.IKKE)).toBe(
    "success"
  );
  expect(finnRiktigTagVariant(KortStatus.OVERM)).toBe(
    "success"
  );

  expect(finnRiktigTagVariant(KortStatus.FEIL)).toBe(
    "error"
  );
  expect(finnRiktigTagVariant(KortStatus.VENTE)).toBe(
    "error"
  );
  expect(finnRiktigTagVariant(KortStatus.FMOPP)).toBe(
    "error"
  );
  expect(finnRiktigTagVariant(KortStatus.FUOPP)).toBe(
    "error"
  );
});
