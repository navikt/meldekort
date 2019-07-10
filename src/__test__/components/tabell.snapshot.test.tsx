import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import Tabell from '../../app/components/tabell/desktop/tabell';

it('Tabell', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Tabell rows={[1, 2, 3]} columns={['En', 'To', 'Tre']} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
