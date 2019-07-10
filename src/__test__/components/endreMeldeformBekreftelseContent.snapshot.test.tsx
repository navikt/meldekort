import * as React from 'react';
import { endreMeldeformBekreftelseContent } from '../../app/components/modal/endreMeldeformBekreftelseContent';

it('endreMeldeformBekreftelseContent', () => {
  expect(endreMeldeformBekreftelseContent()).toMatchSnapshot();
});
