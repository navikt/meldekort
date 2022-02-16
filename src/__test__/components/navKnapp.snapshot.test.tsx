import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper, {
  setLocalesBeforeAll,
} from '../testSetup/providerWrapper';
import NavKnapp, { KnappTyper } from '../../app/components/knapp/navKnapp';

setLocalesBeforeAll();

it('NavKnapp', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <NavKnapp
        type={KnappTyper.HOVED}
        nestePath={'/test'}
        tekstid={'naviger.neste'}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
