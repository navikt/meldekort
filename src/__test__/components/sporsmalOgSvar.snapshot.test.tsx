import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ProviderWrapper from '../testSetup/providerWrapper';
import SporsmalOgSvarVisning from '../../app/components/meldekortdetaljer/sporsmalvisning/sporsmalOgSvar';
import { sporsmalOgSvarTest } from '../testSetup/testData';

Enzyme.configure({ adapter: new Adapter() });

it('SporsmalOgSvarVisning', () => {
  const tree = shallow(
    <ProviderWrapper>
      <SporsmalOgSvarVisning sporsmalOgSvar={sporsmalOgSvarTest} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
