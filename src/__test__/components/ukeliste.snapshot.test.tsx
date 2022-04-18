import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ProviderWrapper from '../testSetup/providerWrapper';
import Ukeliste from '../../app/components/meldekortdetaljer/ukevisning/ukeliste';
import { mkDagerTEST, mkTEST } from '../testSetup/testData';
import { TypeYtelse } from '../../app/utils/teksterUtil';

Enzyme.configure({ adapter: new Adapter() });

it('Ukeliste', () => {
  const tree = shallow(
    <ProviderWrapper>
      <Ukeliste
        aktivtMeldekort={mkTEST}
        typeYtelsePostfix={TypeYtelse.AAP}
        meldekortDager={mkDagerTEST}
        ukeNr={1}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
