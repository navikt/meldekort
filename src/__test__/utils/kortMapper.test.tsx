import { mapKortStatusTilTekst, mapKortTypeTilTekst } from "../../app/utils/kortMapper";
import { KortStatus, KortType } from "../../app/types/meldekort";
import { setLocalesBeforeAll } from "../testSetup/providerWrapper";

const feilet = "Behandling feilet ";
const ferdig = "Ferdig behandlet ";
const behandling = "Under behandling ";

setLocalesBeforeAll();

it("mapKortStatusTilTekst", () => {
  expect(mapKortStatusTilTekst(KortStatus.FEIL, KortType.AAP)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.FERDI, KortType.AAP)).toBe(ferdig);
  expect(mapKortStatusTilTekst(KortStatus.FMOPP, KortType.AAP)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.FUOPP, KortType.AAP)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.IKKE, KortType.AAP)).toBe(ferdig);
  expect(mapKortStatusTilTekst(KortStatus.KLAR, KortType.AAP)).toBe("Klar til behandling ");
  expect(mapKortStatusTilTekst(KortStatus.NYKTR, KortType.AAP)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.OVERM, KortType.AAP)).toBe(ferdig);
  expect(mapKortStatusTilTekst(KortStatus.REGIS, KortType.AAP)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.UBEHA, KortType.AAP)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.VENTE, KortType.AAP)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.VENTE, KortType.KORRIGERT_ELEKTRONISK)).toBe("Korrigert meldekort ");
});

it("mapKortTypeTilTekst", () => {
  expect(mapKortTypeTilTekst(KortType.ORDINAER)).toBe("Papirkort ");
  expect(mapKortTypeTilTekst(KortType.ERSTATNING)).toBe("Erstatningskort ");
  expect(mapKortTypeTilTekst(KortType.RETUR)).toBe("Returkort ");
  expect(mapKortTypeTilTekst(KortType.ELEKTRONISK)).toBe("Elektronisk kort ");
  expect(mapKortTypeTilTekst(KortType.AAP)).toBe("Automatisk utfylt kort ");
  expect(mapKortTypeTilTekst(KortType.ORDINAER_MANUELL)).toBe(
    "Manuelt utfylt kort "
  );
  expect(mapKortTypeTilTekst(KortType.MASKINELT_OPPDATERT)).toBe(
    "Maskinelt oppdatert "
  );
  expect(mapKortTypeTilTekst(KortType.MANUELL_ARENA)).toBe(
    "Manuelt opprettet kort "
  );
  expect(mapKortTypeTilTekst(KortType.KORRIGERT_ELEKTRONISK)).toBe(
    "Elektronisk korrigert "
  );
});
