import * as React from 'react';
import {
  mapKortStatusTilTekst,
  mapKortTypeTilTekst,
} from '../../app/utils/kortMapper';
import { KortStatus, KortType } from '../../app/types/meldekort';
import { setLocalesBeforeAll } from '../testSetup/providerWrapper';

const ingen = 'Ingen beregning';
const behandling = 'Til behandling';
const manuell = 'Til manuell saksbehandling';

setLocalesBeforeAll();

it('mapKortStatusTilTekst', () => {
  expect(mapKortStatusTilTekst(KortStatus.OPPRE)).toBe('Kortet er opprettet');
  expect(mapKortStatusTilTekst(KortStatus.SENDT)).toBe('Kortet er sendt ut');
  expect(mapKortStatusTilTekst(KortStatus.SLETT)).toBe('Vises ikke');
  expect(mapKortStatusTilTekst(KortStatus.REGIS)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.FMOPP)).toBe(manuell);
  expect(mapKortStatusTilTekst(KortStatus.FUOPP)).toBe('Nytt papirkort sendt');
  expect(mapKortStatusTilTekst(KortStatus.KLAR)).toBe('Klar til beregning');
  expect(mapKortStatusTilTekst(KortStatus.IKKE)).toBe(ingen);
  expect(mapKortStatusTilTekst(KortStatus.OVERM)).toBe(ingen);
  expect(mapKortStatusTilTekst(KortStatus.NYKTR)).toBe(behandling);
  expect(mapKortStatusTilTekst(KortStatus.FERDI)).toBe('Kortet er beregnet');
  expect(mapKortStatusTilTekst(KortStatus.FEIL)).toBe(manuell);
  expect(mapKortStatusTilTekst(KortStatus.OPPF)).toBe('Ikke i bruk');
  expect(mapKortStatusTilTekst(KortStatus.VENTE)).toBe('Venter på annet kort');
  expect(mapKortStatusTilTekst(KortStatus.UBEHA)).toBe(behandling);
});

it('mapKortTypeTilTekst', () => {
  expect(mapKortTypeTilTekst(KortType.RETUR)).toBe('Returkort');
  expect(mapKortTypeTilTekst(KortType.ORDINAER)).toBe('Papirkort');
  expect(mapKortTypeTilTekst(KortType.ERSTATNING)).toBe('Erstatningskort');
  expect(mapKortTypeTilTekst(KortType.ELEKTRONISK)).toBe('Elektronisk kort');
  expect(mapKortTypeTilTekst(KortType.AAP)).toBe('Automatisk utfylt kort');
  expect(mapKortTypeTilTekst(KortType.ORDINAER_MANUELL)).toBe(
    'Manuelt utfylt kort'
  );
  expect(mapKortTypeTilTekst(KortType.MASKINELT_OPPDATERT)).toBe(
    'Maskinelt oppdatert'
  );
  expect(mapKortTypeTilTekst(KortType.MANUELL_ARENA)).toBe(
    'Manuelt opprettet kort'
  );
  expect(mapKortTypeTilTekst(KortType.KORRIGERT_ELEKTRONISK)).toBe(
    'Elektronisk korrigert'
  );
});
