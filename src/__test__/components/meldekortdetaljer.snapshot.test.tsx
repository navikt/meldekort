import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import Meldekortdetaljer from '../../app/components/meldekortdetaljer/meldekortdetaljer';
import { mkDetaljerTEST } from '../utils/testData';

Enzyme.configure({ adapter: new Adapter() });

it('Meldekortdetaljer', () => {
  const tree = shallow(
    <ProviderWrapper>
      <Meldekortdetaljer erAap={true} meldekortdetaljer={mkDetaljerTEST} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
