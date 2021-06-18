import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../testSetup/providerWrapper';
import Meldekortdetaljer from '../../app/components/meldekortdetaljer/meldekortdetaljer';
import { mkDetaljerTEST, mkTEST } from '../testSetup/testData';
import { TypeYtelse } from '../../app/utils/teksterUtil';

Enzyme.configure({ adapter: new Adapter() });

it('Meldekortdetaljer', () => {
  const tree = shallow(
    <ProviderWrapper initialStateName={'aktivtMeldekort'} initialState={mkTEST}>
      <Meldekortdetaljer
        aktivtMeldekort={mkTEST}
        typeYtelse={TypeYtelse.AAP}
        meldekortdetaljer={mkDetaljerTEST}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
