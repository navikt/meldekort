import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../testSetup/providerWrapper';
import Utskrift from '../../app/components/print/utskrift';
import { MeldeForm, Person, PersonInfo } from '../../app/types/person';

const person: Person = {
  maalformkode: '',
  meldeform: MeldeForm.ELEKTRONISK,
  meldekort: [],
  etterregistrerteMeldekort: [],
  fravaer: [],
  id: '',
  antallGjenstaaendeFeriedager: 0,
};

const personInfo: PersonInfo = {
  personId: 0,
  fodselsnr: '',
  etternavn: '',
  fornavn: '',
};
it('Utskrift', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Utskrift person={person} personInfo={personInfo} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
