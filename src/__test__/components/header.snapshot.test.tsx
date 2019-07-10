import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import Header from '../../app/components/header/header';

Enzyme.configure({ adapter: new Adapter() });

it('Header', () => {
  const tree = shallow(
    <ProviderWrapper>
      <Header tittel={'TEST'} />
    </ProviderWrapper>
  );

  expect(tree).toMatchSnapshot();
});
