import * as React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding } from '../../types/ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Ingress, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
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
  hentInnsendingsklareMeldekort,
  hentMeldekortRaderFraPerson,
  hentPeriodeDatoKolonner,
} from '../../utils/meldekortUtils';
import { useEffect } from 'react';
import MeldingOmMeldekortSomIkkeErKlare from './meldingOmIkkeKlareMeldekort';
import SendMeldekortInnhold from './sendMeldekortInnhold';
import { loggAktivitet } from '../../utils/amplitudeUtils';
import { downloadMessages } from '../../reducers/localesReducer';
import { updateIntl } from 'react-intl-redux';

interface MapStateToProps {
  person: Person;
  baksystemFeilmelding: BaksystemFeilmelding;
  router: Router;
  sendteMeldekort: SendtMeldekort[];
  locale: string;
}
interface MapDispatchToProps {
  hentPerson: () => void;
  leggTilAktivtMeldekort: (locale: string, meldekort: Meldekort) => void;
  resetInnsending: () => void;
  settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
}

type Props = MapDispatchToProps & MapStateToProps;

function SendMeldekort({
  person,
  baksystemFeilmelding,
  router,
  sendteMeldekort,
  hentPerson,
  leggTilAktivtMeldekort,
  resetInnsending,
  settInnsendingstype,
  locale,
}: Props) {
  const hentFeilmeldingEllerData = (rader: MeldekortRad[], kolonner: any) => {
    if (rader.length > 0) {
      if (rader.length < 5) {
        return (
          <SendMeldekortInnhold
            rows={rader}
            columns={kolonner}
            router={router}
            innsendingsklareMeldekort={innsendingsklareMeldekort}
            baksystemFeilmelding={baksystemFeilmelding}
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
          rows={rader}
          person={person}
          innsendingsklareMeldekort={innsendingsklareMeldekort}
        />
      );
    }
  };

  const harKunEttMeldekort = (locale: string, meldekortListe: Meldekort[]) => {
    if (meldekortListe.length === 1) {
      leggTilAktivtMeldekort(locale, meldekortListe[0]);
      settInnsendingstype(Innsendingstyper.INNSENDING);
      return true;
    }
    return false;
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

    loggAktivitet('Viser send');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !harKunEttMeldekort(locale, innsendingsklareMeldekort) ? (
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
        ) : person.meldeform === MeldeForm.IKKE_SATT ? (
          <div className="meldekort-spinner">
            <NavFrontendSpinner type="XL" />
          </div>
        ) : (
          hentFeilmeldingEllerData(rows, columns)
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
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    person: state.person,
    router: selectRouter(state),
    baksystemFeilmelding: selectFeilmelding(state),
    sendteMeldekort: state.meldekort.sendteMeldekort,
    locale: state.intl.locale,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    leggTilAktivtMeldekort: (locale: string, aktivtMeldekort: Meldekort) => {
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort));
      downloadMessages(
        locale,
        aktivtMeldekort.meldeperiode.fra.toString().substring(0, 19)
      ).then((messages: object) => {
        dispatch(updateIntl({ locale: locale, messages: messages }));
      });
    },
    settInnsendingstype: (innsendingstype: Innsendingstyper) => {
      dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMeldekort);
