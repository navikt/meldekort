import * as React from 'react';
import { loggInnContent } from '../../app/components/modal/loggInnContent';

it('loggInnContent', () => {
  expect(loggInnContent()).toMatchSnapshot();
});
