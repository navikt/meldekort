import {
  mapKortStatusTilTekst,
  mapKortTypeTilTekst
} from '../../app/utils/kortMapper';
import { KortStatus, KortType } from '../../app/types/meldekort';
import { setLocalesBeforeAll } from '../testSetup/providerWrapper';

const feilet = 'Behandling feilet ';
const ferdig = 'Ferdig behandlet ';
const behandling = 'Under behandling ';

setLocalesBeforeAll();

it('mapKortStatusTilTekst', () => {
  expect(mapKortStatusTilTekst(KortStatus.FEIL)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.FERDI)).toBe(ferdig);
  expect(mapKortStatusTilTekst(KortStatus.FMOPP)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.FUOPP)).toBe(feilet);
  expect(mapKortStatusTilTekst(KortStatus.IKKE)).toBe(ferdig);
  expect(mapKortStatusTilTekst(KortStatus.KLAR)).toBe('Klar til behandling ');
  expect(mapKortStatusTilTekst(KortStatus.NYKTR)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.OVERM)).toBe(ferdig);
  expect(mapKortStatusTilTekst(KortStatus.REGIS)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.UBEHA)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.VENTE)).toBe(feilet);
});

it('mapKortTypeTilTekst', () => {
  expect(mapKortTypeTilTekst(KortType.ORDINAER)).toBe('Papirkort ');
  expect(mapKortTypeTilTekst(KortType.ERSTATNING)).toBe('Erstatningskort ');
  expect(mapKortTypeTilTekst(KortType.RETUR)).toBe('Returkort ');
  expect(mapKortTypeTilTekst(KortType.ELEKTRONISK)).toBe('Elektronisk kort ');
  expect(mapKortTypeTilTekst(KortType.AAP)).toBe('Automatisk utfylt kort ');
  expect(mapKortTypeTilTekst(KortType.ORDINAER_MANUELL)).toBe(
    'Manuelt utfylt kort '
  );
  expect(mapKortTypeTilTekst(KortType.MASKINELT_OPPDATERT)).toBe(
    'Maskinelt oppdatert '
  );
  expect(mapKortTypeTilTekst(KortType.MANUELL_ARENA)).toBe(
    'Manuelt opprettet kort '
  );
  expect(mapKortTypeTilTekst(KortType.KORRIGERT_ELEKTRONISK)).toBe(
    'Elektronisk korrigert '
  );
});
