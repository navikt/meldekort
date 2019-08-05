import * as React from 'react';
import { ikkeFortsetteRegistrertContent } from '../../app/components/modal/ikkeFortsetteRegistrertContent';

it('ikkeFortsetteRegistrertContent', () => {
  expect(ikkeFortsetteRegistrertContent()).toMatchSnapshot();
});
