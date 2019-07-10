import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import SporsmalOgSvarVisning from '../../app/components/meldekortdetaljer/sporsmalvisning/sporsmalOgSvar';

Enzyme.configure({ adapter: new Adapter() });

it('SporsmalOgSvarVisning', () => {
  const tree = shallow(
    <ProviderWrapper>
      <SporsmalOgSvarVisning sporsmalOgSvar={sos} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});

const sos = [
  {
    kategori: 'arbeid',
    sporsmal: 'sporsmal.arbeid',
    forklaring: 'forklaring.sporsmal.arbeid',
    svar: true,
    formatertDato: '20.01.2019',
  },
  {
    kategori: 'aktivitetArbeid',
    sporsmal: 'sporsmal.aktivitetArbeid',
    forklaring: 'forklaring.sporsmal.aktivitetArbeid',
    svar: false,
    formatertDato: '20.01.2019',
  },
];
