import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import Hjelpetekst from '../../app/components/meldekortdetaljer/ukevisning/hjelpetekst';
import { MeldekortDag } from '../../app/types/meldekort';

it('Sprakvelger', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Hjelpetekst meldekortDag={mkDag} erAap={true} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});

const mkDag: MeldekortDag = {
  dag: 1,
  arbeidetTimerSum: 7.5,
  syk: false,
  annetFravaer: true,
  kurs: false,
};
