import * as React from 'react';
import { finnRiktigEtikettKlasse } from '../../app/utils/statusEtikettUtil';

it('finnRiktigEtikettKlasse', () => {
  expect(finnRiktigEtikettKlasse('Klar til beregning')).toBe(
    'etikettbase__informativ'
  );
  expect(finnRiktigEtikettKlasse('Til behandling')).toBe(
    'etikettbase__informativ'
  );
  expect(finnRiktigEtikettKlasse('Kortet er beregnet')).toBe(
    'etikettbase__positiv'
  );
  expect(finnRiktigEtikettKlasse('Ingen beregning')).toBe(
    'etikettbase__fremhevet'
  );
  expect(finnRiktigEtikettKlasse('Test')).toBe('etikettbase__fokusert');
});
