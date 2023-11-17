import { hentUkedagerSomStringListe } from '../../app/utils/ukedager';
import { setLocalesBeforeAll } from '../testSetup/providerWrapper';

setLocalesBeforeAll();

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
