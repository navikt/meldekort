import * as React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProviderWrapper from '../utils/providerWrapper';
import Ukeliste from '../../app/components/meldekortdetaljer/ukevisning/ukeliste';
import {
  KortStatus,
  KortType,
  Meldegruppe,
  Meldekort,
  MeldekortDag,
  Meldeperiode,
} from '../../app/types/meldekort';

Enzyme.configure({ adapter: new Adapter() });

it('Ukeliste', () => {
  const tree = shallow(
    <ProviderWrapper>
      <Ukeliste aktivtMeldekort={mk} erAap={true} meldekortDager={mkDager} ukeNr={1} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});

const dateString = '2019-01-01T10:00:00';

const meldeperiode: Meldeperiode = {
  til: new Date(dateString),
  fra: new Date(dateString),
  kanKortSendes: true,
  kortKanSendesFra: new Date(dateString),
  periodeKode: '201901',
};

const mk: Meldekort = {
  meldekortId: 1,
  kortType: KortType.ELEKTRONISK,
  meldeperiode: meldeperiode,
  meldegruppe: Meldegruppe.DAGP,
  kortStatus: KortStatus.OPPRE,
  bruttoBelop: 0,
  mottattDato: new Date(dateString),
  korrigerbart: true,
};

const mkDager: MeldekortDag[] = [
  {
    dag: 1,
    arbeidetTimerSum: 7.5,
    syk: false,
    annetFravaer: true,
    kurs: false,
  },
];
