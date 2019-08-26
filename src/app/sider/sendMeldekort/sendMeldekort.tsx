import * as React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/desktop/tabell';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding } from '../../types/ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Ingress, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { InnsendingActions } from '../../actions/innsending';
import { Innsendingstyper } from '../../types/innsending';
import { Meldekort, MeldekortRad, SendtMeldekort } from '../../types/meldekort';
import { PersonActions } from '../../actions/person';
import { RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectFeilmelding } from '../../selectors/ui';
import { Redirect } from 'react-router';
import { selectRouter } from '../../selectors/router';
import { MeldeForm, Person } from '../../types/person';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import {
  harKortStatusOPPRellerSENDT,
  hentInnsendingsklareMeldekort,
  hentMeldekortRaderFraPerson,
} from '../../utils/meldekortUtils';
import { useEffect } from 'react';
import MeldingOmMeldekortSomIkkeErKlare from './MeldingOmIkkeKlareMeldekort';
import InnsendingVisning from './InnsendingVisning';

interface MapStateToProps {
  person: Person;
  baksystemFeilmelding: BaksystemFeilmelding;
  router: Router;
  sendteMeldekort: SendtMeldekort[];
}
interface MapDispatchToProps {
  hentPerson: () => void;
  leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
  resetInnsending: () => void;
  settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
}

type Props = MapDispatchToProps & MapStateToProps;

// tslint:disable-next-line:max-line-length
const SendMeldekort: React.FC<Props> = ({
  person,
  baksystemFeilmelding,
  router,
  sendteMeldekort,
  hentPerson,
  leggTilAktivtMeldekort,
  resetInnsending,
  settInnsendingstype,
}) => {
  const innsendingsklareMeldekort = hentInnsendingsklareMeldekort(
    person.meldekort,
    sendteMeldekort
  );

  // tslint:disable-next-statement
  useEffect(() => {
    if (innsendingsklareMeldekort.length !== 1) {
      resetInnsending();
    }
    hentPerson();
  }, []);

  const hentFeilmeldingEllerData = (rows: MeldekortRad[], columns: any) => {
    if (rows.length > 0) {
      if (rows.length < 5) {
        return (
          <InnsendingVisning
            rows={rows}
            columns={columns}
            router={router}
            innsendingsklareMeldekort={innsendingsklareMeldekort}
          />
        );
      } else {
        return (
          <div className="send-meldekort-varsel">
            <Ingress>
              <FormattedMessage id="sendMeldekort.info.forMangeMeldekort" />
            </Ingress>
            <Normaltekst>
              <FormattedMessage id="sendMeldekort.info.forMangeMeldekort.feilmelding" />
            </Normaltekst>
          </div>
        );
      }
    } else {
      return (
        <MeldingOmMeldekortSomIkkeErKlare
          rows={rows}
          person={person}
          innsendingsklareMeldekort={innsendingsklareMeldekort}
        />
      );
    }
  };

  const ventPaaDataOgReturnerSpinnerFeilmeldingEllerTabell = (
    rows: MeldekortRad[],
    columns: any
  ) => {
    if (person.meldeform === MeldeForm.IKKE_SATT) {
      return (
        <div className="meldekort-spinner">
          <NavFrontendSpinner type="XL" />
        </div>
      );
    } else {
      return hentFeilmeldingEllerData(rows, columns);
    }
  };

  const rows = hentMeldekortRaderFraPerson(innsendingsklareMeldekort);
  const columns = [
    { key: 'periode', label: 'Periode' },
    { key: 'dato', label: 'Dato' },
  ];

  const harKunEttMeldekort = (meldekortListe: Meldekort[]) => {
    if (meldekortListe.length === 1) {
      leggTilAktivtMeldekort(meldekortListe[0]);
      settInnsendingstype(Innsendingstyper.innsending);
      return true;
    }
    return false;
  };

  return !harKunEttMeldekort(innsendingsklareMeldekort) ? (
    <main className="sideinnhold">
      <section className="seksjon flex-innhold tittel-sprakvelger">
        <Innholdstittel>
          {' '}
          <FormattedMessage id="overskrift.innsending" />{' '}
        </Innholdstittel>
        <Sprakvelger />
      </section>
      <section className="seksjon">
        {baksystemFeilmelding.visFeilmelding ? (
          <UIAlertstripeWrapper />
        ) : (
          ventPaaDataOgReturnerSpinnerFeilmeldingEllerTabell(rows, columns)
        )}
      </section>
    </main>
  ) : (
    <Redirect
      exact={true}
      from="/send-meldekort"
      to="/send-meldekort/innsending"
    />
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    person: state.person,
    router: selectRouter(state),
    baksystemFeilmelding: selectFeilmelding(state),
    sendteMeldekort: state.meldekort.sendteMeldekort,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
    settInnsendingstype: (innsendingstype: Innsendingstyper) => {
      dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendMeldekort);
