import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import HovedMeny from '../../app/components/meny/desktop/hovedMeny';
import { menyPunkterTEST } from '../utils/testData';

it('HovedMeny', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <HovedMeny menypunkter={menyPunkterTEST} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
