import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import Utskrift from '../../app/components/print/utskrift';

it('Sprakvelger', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Utskrift />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
