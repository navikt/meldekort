import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper, {
  setLocalesBeforeAll,
} from '../testSetup/providerWrapper';
import Feilside from '../../app/components/feilside/feilside';

setLocalesBeforeAll();

it('Feilside', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Feilside />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
