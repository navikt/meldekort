import * as React from 'react';
import { obsFeilmeldingContent } from '../../app/components/feil/obsFeilmeldingContent';

it('ObsFeilmeldingContent', () => {
  expect(obsFeilmeldingContent()).toMatchSnapshot();
});
