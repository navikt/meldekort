import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import UkePanel from '../../app/components/ukepanel/ukepanel';
import { utfyllingFeilTEST } from '../utils/testData';

Enzyme.configure({ adapter: new Adapter() });

it('UkePanel', () => {
  const tree = shallow(
    <ProviderWrapper>
      <UkePanel
        ukenummer={1}
        erAap={false}
        datoTittel={'naviger.neste'}
        faktiskUkeNummer={'1'}
        utfyllingFeil={utfyllingFeilTEST}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
