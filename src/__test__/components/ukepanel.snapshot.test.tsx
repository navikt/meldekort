import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../testSetup/providerWrapper';
import UkePanel from '../../app/components/ukepanel/ukepanel';
import { innsendingTEST, utfyllingFeilTEST } from '../testSetup/testData';

Enzyme.configure({ adapter: new Adapter() });

it('UkePanel', () => {
  const tree = shallow(
    <ProviderWrapper
      initialStateName={'innsending'}
      initialState={innsendingTEST}
    >
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
