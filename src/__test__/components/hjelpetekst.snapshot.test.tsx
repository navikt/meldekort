import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import Hjelpetekst from '../../app/components/meldekortdetaljer/ukevisning/hjelpetekst';
import { mkDagTEST } from '../utils/testData';

it('Hjelpetekst', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Hjelpetekst meldekortDag={mkDagTEST} erAap={true} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
