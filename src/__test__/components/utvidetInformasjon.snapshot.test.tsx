import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ProviderWrapper from '../testSetup/providerWrapper';
import UtvidetInformasjon from '../../app/components/utvidetinformasjon/utvidetInformasjon';

Enzyme.configure({ adapter: new Adapter() });

it('UtvidetInformasjon', () => {
  const tree = shallow(
    <ProviderWrapper>
      <UtvidetInformasjon>
        <span>Test</span>
      </UtvidetInformasjon>
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
