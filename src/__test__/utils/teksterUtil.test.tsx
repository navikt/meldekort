import * as React from 'react';
import { finnesIntlId } from '../../app/utils/teksterUtil';

it('finnesIntlId', () => {
  expect(finnesIntlId('naviger.neste')).toBe('naviger.neste');
  expect(finnesIntlId('naviger.neste-AAP')).toBe('naviger.neste');
  expect(finnesIntlId('kurs.required-AAP')).toBe('kurs.required-AAP');
});
