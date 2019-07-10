import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import DOMPortal from '../../app/components/print/DOMPortal';

it('Sprakvelger', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <DOMPortal />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
