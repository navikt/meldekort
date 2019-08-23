import * as React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/desktop/tabell';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding } from '../../types/ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Element,
  Ingress,
  Innholdstittel,
  Normaltekst,
} from 'nav-frontend-typografi';
import { hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { InnsendingActions } from '../../actions/innsending';
import { Innsendingstyper } from '../../types/innsending';
import {
  KortStatus,
  Meldekort,
  MeldekortRad,
  SendtMeldekort,
} from '../../types/meldekort';
import { PersonActions } from '../../actions/person';
import { RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectFeilmelding } from '../../selectors/ui';
import { Redirect } from 'react-router';
import { selectRouter } from '../../selectors/router';
import { MeldeForm, Person } from '../../types/person';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import { erMeldekortSendtInnTidligere } from '../../utils/meldekortUtils';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';
import { useEffect } from 'react';
import MeldingOmMeldekortSomIkkeErKlare from './MeldingOmIkkeKlareMeldekort';

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
  const harEttMeldekort = () => {
    let meldekortListe = filtrerMeldekortListe(person.meldekort);

    if (meldekortListe.length === 1) {
      leggTilAktivtMeldekort(meldekortListe[0]);
      settInnsendingstype(Innsendingstyper.innsending);
      return true;
    }
    return false;
  };

  const filtrerMeldekortListe = (meldekort: Meldekort[]): Meldekort[] => {
    if (typeof meldekort === 'undefined') {
      return [];
    }
    return meldekort.filter(meldekortObj => {
      if (
        meldekortObj.kortStatus === KortStatus.OPPRE ||
        meldekortObj.kortStatus === KortStatus.SENDT
      ) {
        if (meldekortObj.meldeperiode.kanKortSendes) {
          return !erMeldekortSendtInnTidligere(meldekortObj, sendteMeldekort);
        }
      }
      return false;
    });
  };

  const hentMeldekortRaderFraPerson = (
    meldekort: Meldekort[]
  ): MeldekortRad[] => {
    let radliste: MeldekortRad[] = [];

    if (filtrerMeldekortListe(meldekort) != null) {
      const liste = filtrerMeldekortListe(meldekort).map(meldekortObj => {
        if (
          meldekortObj.kortStatus === KortStatus.OPPRE ||
          meldekortObj.kortStatus === KortStatus.SENDT
        ) {
          if (meldekortObj.meldeperiode.kanKortSendes) {
            radliste.push({
              periode: hentUkePeriode(
                meldekortObj.meldeperiode.fra,
                meldekortObj.meldeperiode.til
              ),
              dato: hentDatoPeriode(
                meldekortObj.meldeperiode.fra,
                meldekortObj.meldeperiode.til
              ),
            });
          }
        }
      });
    }
    /*    if (this.filtrerMeldekortListe(person.meldekort) != null) {
      const rad = this.filtrerMeldekortListe(person.meldekort).map(meldekortObj => {
        if (
          meldekortObj.kortStatus === KortStatus.OPPRE ||
          meldekortObj.kortStatus === KortStatus.SENDT
        ) {
          if (meldekortObj.meldeperiode.kanKortSendes) {
            return {
              periode: hentUkePeriode(
                meldekortObj.meldeperiode.fra,
                meldekortObj.meldeperiode.til
              ),
              dato: hentDatoPeriode(
                meldekortObj.meldeperiode.fra,
                meldekortObj.meldeperiode.til
              ),
            };
          }
        } else {
          return null;
        }
      });
      radliste.push(rad);
    }*/
    console.log('radliste:', radliste);
    return radliste;
  };

  // tslint:disable-next-statement
  useEffect(() => {
    if (filtrerMeldekortListe(person.meldekort).length !== 1) {
      resetInnsending();
    }
    hentPerson();
  }, []);

  const hentFeilmeldingEllerData = (rows: MeldekortRad[], columns: any) => {
    if (rows.length > 0) {
      if (rows.length < 5) {
        return hentTabellOgTilhorendeElementer(rows, columns);
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
          filtrerMeldekortListe={filtrerMeldekortListe}
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

  const hentTabellOgTilhorendeElementer = (
    rows: MeldekortRad[],
    columns: any
  ) => {
    return (
      <>
        <div className="item">
          <FormattedHTMLMessage id="sendMeldekort.info.kanSende" />
        </div>
        <section className="seksjon">
          <div className="item">
            <Tabell rows={rows} columns={columns} />
          </div>
        </section>
        <section className="seksjon">
          <div className="box">
            <Normaltekst>
              <FormattedHTMLMessage id="sendMeldekort.info.neste" />
            </Normaltekst>
            <Normaltekst>
              <FormattedHTMLMessage id="sendMeldekort.info.eldstePerioden" />
            </Normaltekst>
            <Normaltekst>
              <FormattedHTMLMessage id="sendMeldekort.info.automatiskLedet" />
            </Normaltekst>
          </div>
        </section>
        <section className="seksjon flex-innhold sentrert">
          <NavKnapp
            type={knappTyper.hoved}
            nestePath={router.location.pathname + '/innsending'}
            tekstid={'naviger.neste'}
            nesteAktivtMeldekort={filtrerMeldekortListe(person.meldekort)[0]}
            nesteInnsendingstype={Innsendingstyper.innsending}
          />
        </section>
      </>
    );
  };

  const rows = hentMeldekortRaderFraPerson(person.meldekort);
  const columns = [
    { key: 'periode', label: 'Periode' },
    { key: 'dato', label: 'Dato' },
  ];

  const ettMeldekort = harEttMeldekort();

  return !ettMeldekort ? (
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
