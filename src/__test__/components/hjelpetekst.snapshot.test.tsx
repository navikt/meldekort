import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper, {
  setLocalesBeforeAll,
} from '../testSetup/providerWrapper';
import Hjelpetekst from '../../app/components/meldekortdetaljer/ukevisning/hjelpetekst';
import { mkDagTEST } from '../testSetup/testData';
import { TypeYtelse } from '../../app/utils/teksterUtil';

setLocalesBeforeAll();

it('Hjelpetekst', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Hjelpetekst
        meldekortDag={mkDagTEST}
        typeYtelsePostfix={TypeYtelse.AAP}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
