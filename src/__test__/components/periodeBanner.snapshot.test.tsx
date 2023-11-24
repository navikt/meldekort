import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PeriodeBanner from '../../app/components/periodeBanner/periodeBanner';
import ProviderWrapper, { setLocalesBeforeAll } from '../testSetup/providerWrapper';
import { mkTEST } from '../testSetup/testData';

setLocalesBeforeAll();

it('PeriodeBanner', () => {
  const tree = renderer.create(
    <ProviderWrapper initialStateName={'aktivtMeldekort'} initialState={mkTEST}>
      <PeriodeBanner />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
