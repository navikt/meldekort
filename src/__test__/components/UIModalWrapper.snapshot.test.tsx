import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../testSetup/providerWrapper';
import UIModalWrapper from '../../app/components/modal/UIModalWrapper';

Enzyme.configure({ adapter: new Adapter() });

it('UIModalWrapper', () => {
  const tree = shallow(
    <ProviderWrapper>
      <div id="meldekort__root">
        <UIModalWrapper />
      </div>
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
