import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import MobilMeny from '../../app/components/meny/mobil/mobilMeny';
import { menyPunkterTEST } from '../utils/testData';

Enzyme.configure({ adapter: new Adapter() });

it('Sprakvelger', () => {
  const tree = shallow(
    <ProviderWrapper>
      <MobilMeny menypunkter={menyPunkterTEST} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
