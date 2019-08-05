import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../testSetup/providerWrapper';
import Utskrift from '../../app/components/print/utskrift';

it('Utskrift', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Utskrift />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
