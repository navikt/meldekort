import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../testSetup/providerWrapper';
import HovedMeny from '../../app/components/meny/desktop/hovedmeny';
import { menyPunkterTEST } from '../testSetup/testData';

it('HovedMeny', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <HovedMeny menypunkter={menyPunkterTEST} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
