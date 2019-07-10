import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import PeriodeBanner from '../../app/components/periodeBanner/periodeBanner';

it('Sprakvelger', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <PeriodeBanner />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
