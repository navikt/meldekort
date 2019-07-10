import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import StegBanner from '../../app/components/stegBanner/stegBanner';

Enzyme.configure({ adapter: new Adapter() });

it('StegBanner', () => {
  const tree = shallow(
    <ProviderWrapper>
      <StegBanner />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
