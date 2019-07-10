import * as React from 'react';
import { ikkeFortsetteRegistrertContent } from '../../app/components/modal/ikkeFortsetteRegistrertContent';

it('Sprakvelger', () => {
  expect(ikkeFortsetteRegistrertContent()).toMatchSnapshot();
});
