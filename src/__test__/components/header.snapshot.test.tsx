import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ProviderWrapper from '../testSetup/providerWrapper';
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
