import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../testSetup/providerWrapper';
import MobilMeny from '../../app/components/meny/mobil/mobilMeny';
import { menyPunkterTEST } from '../testSetup/testData';

Enzyme.configure({ adapter: new Adapter() });

it('MobilMeny', () => {
  const tree = shallow(
    <ProviderWrapper>
      <MobilMeny menypunkter={menyPunkterTEST} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
