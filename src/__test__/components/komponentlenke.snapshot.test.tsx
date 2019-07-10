import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import Komponentlenke from '../../app/components/komponentlenke/komponentlenke';

it('Komponentlenke', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Komponentlenke lenketekst={'Test'} rute={'/testrute'} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
