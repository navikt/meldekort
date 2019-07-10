import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import Meldekortdetaljer from '../../app/components/meldekortdetaljer/meldekortdetaljer';
import { KortType } from '../../app/types/meldekort';

Enzyme.configure({ adapter: new Adapter() });

it('Sprakvelger', () => {
  const tree = shallow(
    <ProviderWrapper>
      <Meldekortdetaljer erAap={true} meldekortdetaljer={mkDetaljer} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});

const dateString = '2019-01-01T10:00:00';

const mkDetaljer = {
  id: '',
  meldekortId: 0,
  meldeperiode: '',
  arkivnokkel: '',
  kortType: KortType.KORRIGERT_ELEKTRONISK,
  meldeDato: new Date(dateString),
  lestDato: new Date(dateString),
  sporsmal: {
    annetFravaer: false,
    arbeidet: false,
    arbeidssoker: false,
    syk: false,
    kurs: false,
    signatur: false,
    meldekortDager: [],
  },
  begrunnelse: '',
};
