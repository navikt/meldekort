import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../testSetup/providerWrapper';
import MobilMenyToggle from '../../app/components/meny/mobil/mobilMenyToggle';

it('MobilMenyToggle', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <MobilMenyToggle />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
