import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import NavKnapp, { knappTyper } from '../../app/components/knapp/navKnapp';

it('NavKnapp', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <NavKnapp type={knappTyper.hoved} nestePath={'/test'} tekstid={'naviger.neste'} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
