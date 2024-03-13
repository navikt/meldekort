import { finnRiktigTagVariant } from "../../app/utils/statusEtikettUtil";
import { KortStatus, KortType } from "../../app/types/meldekort";

it("finnRiktigEtikettKlasse", () => {
  expect(finnRiktigTagVariant(KortStatus.KLAR, KortType.AAP)).toBe(
    "warning"
  );

  expect(finnRiktigTagVariant(KortStatus.REGIS, KortType.AAP)).toBe(
    "info"
  );
  expect(finnRiktigTagVariant(KortStatus.NYKTR, KortType.AAP)).toBe(
    "info"
  );
  expect(finnRiktigTagVariant(KortStatus.UBEHA, KortType.AAP)).toBe(
    "info"
  );

  expect(finnRiktigTagVariant(KortStatus.FERDI, KortType.AAP)).toBe(
    "success"
  );
  expect(finnRiktigTagVariant(KortStatus.IKKE, KortType.AAP)).toBe(
    "success"
  );
  expect(finnRiktigTagVariant(KortStatus.OVERM, KortType.AAP)).toBe(
    "success"
  );

  expect(finnRiktigTagVariant(KortStatus.FEIL, KortType.AAP)).toBe(
    "error"
  );
  expect(finnRiktigTagVariant(KortStatus.VENTE, KortType.AAP)).toBe(
    "error"
  );
  expect(finnRiktigTagVariant(KortStatus.FMOPP, KortType.AAP)).toBe(
    "error"
  );
  expect(finnRiktigTagVariant(KortStatus.FUOPP, KortType.AAP)).toBe(
    "error"
  );

  expect(finnRiktigTagVariant(KortStatus.IKKE, KortType.KORRIGERT_ELEKTRONISK)).toBe(
    "alt3"
  );

  expect(finnRiktigTagVariant(KortStatus.FERDI, KortType.KORRIGERT_ELEKTRONISK)).toBe(
    "success"
  );
});
