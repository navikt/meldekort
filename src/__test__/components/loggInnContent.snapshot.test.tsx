import * as React from 'react';
import { loggInnContent } from '../../app/components/modal/loggInnContent';

it('Sprakvelger', () => {
  expect(loggInnContent()).toMatchSnapshot();
});
