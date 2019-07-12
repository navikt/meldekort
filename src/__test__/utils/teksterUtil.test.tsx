import * as React from 'react';
import { finnesIntlId, hentAapStreng } from '../../app/utils/teksterUtil';

it('hentAapStreng', () => {
  expect(hentAapStreng(true)).toBe('-AAP');
  expect(hentAapStreng(false)).toBe('');
});

it('finnesIntlId', () => {
  expect(finnesIntlId('naviger.neste')).toBe('naviger.neste');
  expect(finnesIntlId('naviger.neste-AAP')).toBe('naviger.neste');
  expect(finnesIntlId('kurs.required-AAP')).toBe('kurs.required-AAP');
});
