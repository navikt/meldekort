import * as React from 'react';
import { RootState } from '../../store/configureStore';
import { PersonActions } from '../../actions/person';
import { InnsendingActions } from '../../actions/innsending';
import { Dispatch } from 'redux';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import { Meldekort, SendtMeldekort } from '../../types/meldekort';
import { Innsendingstyper } from '../../types/innsending';
import { MeldeForm, Person } from '../../types/person';
import { Redirect } from 'react-router';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import {
  hentInnsendingsklareMeldekort,
  hentMeldekortRaderFraPerson,
  hentPeriodeDatoKolonner,
} from '../../utils/meldekortUtils';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useEffect } from 'react';
import EtterregistreringInnhold from './EtterregistreringInnhold';

interface MapStateToProps {
  person: Person;
  router: Router;
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
  router,
  sendteMeldekort,
  hentPerson,
  resetInnsending,
  settInnsendingstype,
  leggTilAktivtMeldekort,
}: Props) {
  const harKunEttMeldekort = (innsendingsklareMeldekort: Meldekort[]) => {
    if (innsendingsklareMeldekort.length === 1) {
      leggTilAktivtMeldekort(innsendingsklareMeldekort[0]);
      settInnsendingstype(Innsendingstyper.etterregistrering);
      return true;
    } else {
      return false;
    }
  };

  const innsendingsklareMeldekort = hentInnsendingsklareMeldekort(
    person.meldekort,
    sendteMeldekort
  );
  const rows = hentMeldekortRaderFraPerson(innsendingsklareMeldekort);
  const columns = hentPeriodeDatoKolonner;

  useEffect(() => {
    if (innsendingsklareMeldekort.length !== 1) {
      resetInnsending();
    }
    hentPerson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return person.meldeform === MeldeForm.IKKE_SATT ? (
    <NavFrontendSpinner type={'XL'} className={'spinforyourlife'} />
  ) : rows.length === 0 ? (
    <Redirect to={'/om-meldekort'} />
  ) : !harKunEttMeldekort(innsendingsklareMeldekort) ? (
    <EtterregistreringInnhold
      router={router}
      columns={columns}
      rows={rows}
      nesteAktivtMeldekort={innsendingsklareMeldekort[0]}
    />
  ) : (
    <Redirect
      exact={true}
      from="/etterregistrer-meldekort"
      to="/etterregistrer-meldekort/innsending"
    />
  );
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    person: state.person,
    router: selectRouter(state),
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
