import * as React from 'react';
import { useEffect } from 'react';
import { RootState } from '../../store/configureStore';
import { PersonActions } from '../../actions/person';
import { InnsendingActions } from '../../actions/innsending';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Meldekort, SendtMeldekort } from '../../types/meldekort';
import { Innsendingstyper } from '../../types/innsending';
import { MeldeForm, Person } from '../../types/person';
import { Navigate } from "react-router-dom";
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import {
  hentInnsendingsklareMeldekort,
  hentMeldekortRaderFraPerson,
  hentPeriodeDatoKolonner,
} from '../../utils/meldekortUtils';
import NavFrontendSpinner from 'nav-frontend-spinner';
import EtterregistreringInnhold from './etterregistreringInnhold';
import { loggAktivitet } from '../../utils/amplitudeUtils';
import { Konstanter } from "../../utils/consts";

interface MapStateToProps {
  person: Person;
  sendteMeldekort: SendtMeldekort[];
}
interface MapDispatchToProps {
  hentPerson: () => void;
  resetInnsending: () => void;
  leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
  settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
}

type Props = MapDispatchToProps & MapStateToProps;

function EtterregistrerMeldekort({
  person,
  sendteMeldekort,
  hentPerson,
  resetInnsending,
  settInnsendingstype,
  leggTilAktivtMeldekort,
}: Props) {
  const harKunEttMeldekort = (meldekort: Meldekort[]) => {
    if (meldekort.length === 1) {
      leggTilAktivtMeldekort(meldekort[0]);
      settInnsendingstype(Innsendingstyper.ETTERREGISTRERING);
      return true;
    } else {
      return false;
    }
  };

  const innsendingsklareMeldekort = hentInnsendingsklareMeldekort(
    person.etterregistrerteMeldekort,
    sendteMeldekort
  );
  const rows = hentMeldekortRaderFraPerson(innsendingsklareMeldekort);
  const columns = hentPeriodeDatoKolonner;

  useEffect(() => {
    if (innsendingsklareMeldekort.length !== 1) {
      resetInnsending();
    }
    hentPerson();
    loggAktivitet('Viser etterregistrere meldekort');
  }, []);

  return person.meldeform === MeldeForm.IKKE_SATT ? (
    <NavFrontendSpinner type={'XL'} className={'spinforyourlife'} />
  ) : rows.length === 0 ? (
    <Navigate to={ Konstanter.basePath + '/om-meldekort' } replace />
  ) : !harKunEttMeldekort(innsendingsklareMeldekort) ? (
    <EtterregistreringInnhold
      columns={columns}
      rows={rows}
      nesteAktivtMeldekort={innsendingsklareMeldekort[0]}
    />
  ) : (
    <Navigate
      to={ Konstanter.basePath + '/etterregistrer-meldekort/innsending' }
      replace
    />
  );
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    person: state.person,
    sendteMeldekort: state.meldekort.sendteMeldekort,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
    settInnsendingstype: (innsendingstype: Innsendingstyper) =>
      dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EtterregistrerMeldekort);
