import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import MobilTabell from '../../app/components/tabell/mobil/mobilTabell';

it('Sprakvelger', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <MobilTabell
        columns={[
          {
            key: 'test',
            label: <span>TEST</span>,
          },
        ]}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
