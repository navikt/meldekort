import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import SporsmalOgSvarVisning from '../../app/components/meldekortdetaljer/sporsmalvisning/sporsmalOgSvar';
import { sporsmalOgSvarTest } from '../utils/testData';

Enzyme.configure({ adapter: new Adapter() });

it('SporsmalOgSvarVisning', () => {
  const tree = shallow(
    <ProviderWrapper>
      <SporsmalOgSvarVisning sporsmalOgSvar={sporsmalOgSvarTest} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
