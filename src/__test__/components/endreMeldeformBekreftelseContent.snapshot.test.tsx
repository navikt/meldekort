import * as React from 'react';
import { endreMeldeformBekreftelseContent } from '../../app/components/modal/endreMeldeformBekreftelseContent';

it('Sprakvelger', () => {
  expect(endreMeldeformBekreftelseContent()).toMatchSnapshot();
});
