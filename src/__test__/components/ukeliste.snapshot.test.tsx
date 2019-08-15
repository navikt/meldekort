import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../testSetup/providerWrapper';
import Ukeliste from '../../app/components/meldekortdetaljer/ukevisning/ukeliste';
import { mkDagerTEST, mkTEST } from '../testSetup/testData';

Enzyme.configure({ adapter: new Adapter() });

it('Ukeliste', () => {
  const tree = shallow(
    <ProviderWrapper>
      <Ukeliste
        aktivtMeldekort={mkTEST}
        erAap={true}
        meldekortDager={mkDagerTEST}
        ukeNr={1}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
