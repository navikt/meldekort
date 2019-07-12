import * as React from 'react';
import {
  hentUkedagerSomStringListe,
  konverterUkedag,
  matchUkedager,
} from '../../app/utils/ukedager';

it('hentUkedagerSomStringListe', () => {
  expect(hentUkedagerSomStringListe()).toStrictEqual([
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lørdag',
    'Søndag',
  ]);
});

it('matchUkedager', () => {
  expect(matchUkedager('Mandag', 'Mandag')).toBe(true);
  expect(matchUkedager('Tirsdag', 'Tuesday')).toBe(true);
  expect(matchUkedager('Lørdag', 'Søndag')).toBe(false);
  expect(matchUkedager('Fredag', 'Thursday')).toBe(false);
});

it('konverterUkedag', () => {
  expect(konverterUkedag('Monday')).toBe('Mandag');
  expect(konverterUkedag('Tirsdag')).toBe('Tirsdag');
  expect(konverterUkedag('Sunday')).toBe('Søndag');
});
