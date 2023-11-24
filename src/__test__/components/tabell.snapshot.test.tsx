import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../testSetup/providerWrapper';
import Tabell from '../../app/components/tabell/desktop/tabell';

it('Tabell', () => {
  const rader = [{k: 1}, {k: 2}, {k: 3}]
  const kolonner = [
    {key: "En", label: <>En</>},
    {key: "To", label: <>To</>},
    {key: "Tre", label: <>Tre</>}
  ]

  const tree = renderer.create(
    <ProviderWrapper>
      <Tabell rows={rader} columns={kolonner} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
