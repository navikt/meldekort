import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import NavKnapp, { KnappTyper } from '../../../components/knapp/navKnapp';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../../actions/innsending';
import { InnsendingState, Innsendingstyper } from '../../../types/innsending';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { Person } from '../../../types/person';
import { RootState } from '../../../store/configureStore';
import {
  Fravaer,
  FravaerTypeEnum,
  KortType,
  Meldekort,
  MeldekortDag,
  Meldekortdetaljer as MDetaljer,
  MeldekortdetaljerInnsending,
  SendtMeldekort,
} from '../../../types/meldekort';
import { hentIntl } from '../../../utils/intlUtil';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { scrollTilElement } from '../../../utils/scroll';
import { Dispatch } from 'redux';
import { kalkulerDato } from '../../../utils/dates';
import { Redirect } from 'react-router';
import { erAktivtMeldekortGyldig } from '../../../utils/meldekortUtils';
import UIAlertstripeWrapper from '../../../components/feil/UIAlertstripeWrapper';
import { selectFeilmelding } from '../../../selectors/ui';
import { BaksystemFeilmelding } from '../../../types/ui';
import { UiActions } from '../../../actions/ui';
import { UtfyltDag } from '../2-utfyllingsside/utfylling/utfyltDagConfig';
import { loggAktivitet } from '../../../utils/amplitudeUtils';
import { finnTypeYtelsePostfix } from '../../../utils/teksterUtil';

interface MapStateToProps {
  innsending: InnsendingState;
  aktivtMeldekort: Meldekort;
  person: Person;
  baksystemFeilmelding: BaksystemFeilmelding;
  sendteMeldekort: SendtMeldekort[];
}

interface MapDispatchToProps {
  oppdaterMeldekortdetaljer: (mdetaljer: MDetaljer) => void;
  settMeldekortdetaljerInnsending: (
    meldekortdetaljerInnsending: MeldekortdetaljerInnsending
  ) => void;
  kontrollerMeldekort: (
    meldekortdetaljerInnsending: MeldekortdetaljerInnsending
  ) => void;
  skjulBaksystemFeilmelding: () => void;
}

type BekreftelseProps = MapStateToProps & MapDispatchToProps;

interface DetaljerOgFeil {
  meldekortdetaljer: MeldekortdetaljerState;
  feilmelding: string;
  senderMeldekort: boolean;
}

class Bekreftelse extends React.Component<BekreftelseProps, DetaljerOgFeil> {
  constructor(props: BekreftelseProps) {
    super(props);
    this.state = {
      meldekortdetaljer: this.konverterInnsendingTilMeldekortdetaljer(),
      feilmelding: '',
      senderMeldekort: false,
    };
  }

  componentDidMount() {
    scrollTilElement(undefined, 'auto');
    loggAktivitet('Viser bekreftelse');
  }

  konverterInnsendingTilMeldekortdetaljer = (): MeldekortdetaljerState => {
    let { aktivtMeldekort, innsending } = this.props;
    let mDet = {
      meldekortdetaljer: {
        id: '',
        meldekortId: this.erInnsendingKorrigering()
          ? innsending.korrigertMeldekortId
          : aktivtMeldekort.meldekortId,
        meldeperiode: aktivtMeldekort.meldeperiode.periodeKode,
        arkivnokkel: '1-ELEKTRONISK',
        kortType: this.erInnsendingKorrigering()
          ? KortType.KORRIGERT_ELEKTRONISK
          : aktivtMeldekort.kortType,
        meldeDato: new Date(),
        lestDato: new Date(),
        begrunnelse: this.erInnsendingKorrigering()
          ? innsending.begrunnelse.valgtArsak
          : '',
        sporsmal: {
          arbeidet:
            innsending.sporsmalsobjekter[0].checked === undefined
              ? false
              : innsending.sporsmalsobjekter[0].checked.endsWith('ja'),
          kurs:
            innsending.sporsmalsobjekter[1].checked === undefined
              ? false
              : innsending.sporsmalsobjekter[1].checked.endsWith('ja'),
          syk:
            innsending.sporsmalsobjekter[2].checked === undefined
              ? false
              : innsending.sporsmalsobjekter[2].checked.endsWith('ja'),
          annetFravaer:
            innsending.sporsmalsobjekter[3].checked === undefined
              ? false
              : innsending.sporsmalsobjekter[3].checked.endsWith('ja'),
          arbeidssoker:
            innsending.sporsmalsobjekter[4].checked === undefined
              ? false
              : innsending.sporsmalsobjekter[4].checked.endsWith('ja'),
          signatur: false,
          meldekortDager: this.hentMeldekortDager(),
        },
      },
    };
    this.props.oppdaterMeldekortdetaljer(mDet.meldekortdetaljer);
    return mDet;
  };

  erInnsendingKorrigering = (): boolean => {
    return (
      this.props.innsending.innsendingstype === Innsendingstyper.KORRIGERING
    );
  };

  konverterMeldekortdetaljerTilMeldekortdetaljerInnsending = (): MeldekortdetaljerInnsending => {
    let { meldekortdetaljer } = this.state.meldekortdetaljer;
    let { aktivtMeldekort } = this.props;
    return {
      meldekortId: meldekortdetaljer.meldekortId,
      kortType: meldekortdetaljer.kortType,
      kortStatus: aktivtMeldekort.kortStatus,
      meldegruppe: aktivtMeldekort.meldegruppe,
      mottattDato: meldekortdetaljer.meldeDato,
      meldeperiode: aktivtMeldekort.meldeperiode,
      erArbeidssokerNestePeriode: meldekortdetaljer.sporsmal.arbeidssoker,
      korrigerbart:
        this.props.innsending.innsendingstype !== Innsendingstyper.KORRIGERING,
      begrunnelse: meldekortdetaljer.begrunnelse,
      signatur: meldekortdetaljer.sporsmal.signatur,
      sesjonsId: 'IKKE I BRUK',
      fravaersdager: this.hentFravaersdager(meldekortdetaljer, aktivtMeldekort),
    };
  };

  hentFravaersdager = (
    meldekortdetaljer: MDetaljer,
    meldekort: Meldekort
  ): Fravaer[] => {
    let fravar: Fravaer[] = [];
    meldekortdetaljer.sporsmal.meldekortDager.forEach(meldekortDag => {
      let dato = kalkulerDato(meldekort.meldeperiode.fra, meldekortDag.dag);
      if (
        typeof meldekortDag.arbeidetTimerSum !== 'undefined' &&
        meldekortDag.arbeidetTimerSum > 0
      ) {
        fravar.push({
          dag: dato,
          type: { typeFravaer: FravaerTypeEnum.ARBEIDS_FRAVAER },
          arbeidTimer: meldekortDag.arbeidetTimerSum,
        });
      }

      if (meldekortDag.syk) {
        fravar.push({
          dag: dato,
          type: { typeFravaer: FravaerTypeEnum.SYKDOM },
        });
      }
      if (meldekortDag.kurs) {
        fravar.push({
          dag: dato,
          type: { typeFravaer: FravaerTypeEnum.KURS_UTDANNING },
        });
      }

      if (meldekortDag.annetFravaer) {
        fravar.push({
          dag: dato,
          type: { typeFravaer: FravaerTypeEnum.ANNET_FRAVAER },
        });
      }
    });
    return fravar;
  };

  hentMeldekortDager = (): MeldekortDag[] => {
    let meldekortdager: MeldekortDag[] = [];
    let dagTeller = 0;
    this.props.innsending.utfylteDager.forEach(function(utfyltDag: UtfyltDag) {
      meldekortdager.push({
        dag: dagTeller,
        arbeidetTimerSum:
          typeof utfyltDag.arbeidetTimer === 'undefined'
            ? 0
            : Number(utfyltDag.arbeidetTimer),
        syk: utfyltDag.syk,
        kurs: utfyltDag.kurs,
        annetFravaer: utfyltDag.annetFravaer,
      });
      dagTeller++;
    });
    return meldekortdager;
  };

  settChecked = () => {
    let detaljer = this.state.meldekortdetaljer;
    detaljer.meldekortdetaljer.sporsmal.signatur = !detaljer.meldekortdetaljer
      .sporsmal.signatur;
    if (detaljer.meldekortdetaljer.sporsmal.signatur) {
      this.setState({ feilmelding: '' });
    }
    this.setState({ meldekortdetaljer: detaljer });
  };

  valider = (): boolean => {
    this.props.skjulBaksystemFeilmelding();
    let sign = this.state.meldekortdetaljer.meldekortdetaljer.sporsmal.signatur;

    if (!sign) {
      this.setState({
        feilmelding: hentIntl().formatMessage({ id: 'utfylling.bekreft.feil' }),
      });
      scrollTilElement('periodebanner');
    } else {
      this.setState({ senderMeldekort: true });
      let mDetaljerInn = this.konverterMeldekortdetaljerTilMeldekortdetaljerInnsending();
      this.props.oppdaterMeldekortdetaljer(
        this.state.meldekortdetaljer.meldekortdetaljer
      );
      this.props.settMeldekortdetaljerInnsending(mDetaljerInn);
      this.props.kontrollerMeldekort(mDetaljerInn);
    }
    return false;
  };

  hoppOverUtfylling = () => {
    let { sporsmal } = this.props.innsending.meldekortdetaljer;
    return (
      !sporsmal.arbeidet &&
      !sporsmal.kurs &&
      !sporsmal.syk &&
      !sporsmal.annetFravaer
    );
  };

  sjekkBaksystemFeilmelding() {
    if (
      this.props.baksystemFeilmelding.visFeilmelding &&
      this.state.senderMeldekort
    ) {
      scrollTilElement(undefined, 'auto');
      this.setState({ senderMeldekort: false });
    }
  }

  render() {
    let { aktivtMeldekort, sendteMeldekort } = this.props;
    let { meldegruppe } = this.props.aktivtMeldekort;
    let { valideringsResultat } = this.props.innsending;
    let { meldekortdetaljer } = this.state.meldekortdetaljer;
    let { feilmelding } = this.state;
    let typeYtelsePostfix = finnTypeYtelsePostfix(meldegruppe);

    if (typeof valideringsResultat !== 'undefined') {
      return valideringsResultat.status === 'FEIL' ? (
        <Redirect
          exact={true}
          from="send-meldekort/innsending/bekreft"
          to="utfylling"
        />
      ) : (
        <Redirect
          exact={true}
          from="send-meldekort/innsending/bekreft"
          to="kvittering"
        />
      );
    } else {
      this.sjekkBaksystemFeilmelding();
      return erAktivtMeldekortGyldig(
        aktivtMeldekort,
        sendteMeldekort,
        this.props.innsending.innsendingstype
      ) ? (
        <main>
          {this.props.baksystemFeilmelding.visFeilmelding ? (
            <UIAlertstripeWrapper />
          ) : null}
          <section className={'seksjon'}>
            <AlertStripe type={'advarsel'}>
              <span>
                {`${hentIntl().formatMessage({
                  id: 'overskrift.steg3.info.ikkeSendt',
                })}
                  ${hentIntl().formatMessage({
                    id: 'overskrift.steg3.info.bekreftVerdier',
                  })}`}
              </span>
            </AlertStripe>
          </section>
          <div id="feilmelding">
            {this.state.feilmelding === '' ? null : (
              <AlertStripe type={'feil'} className={'utfylling__feilmelding'}>
                {this.state.feilmelding}
              </AlertStripe>
            )}
          </div>
          <section className="seksjon flex-innhold tittel-sprakvelger">
            <Innholdstittel>
              <FormattedMessage id="overskrift.steg3" />
            </Innholdstittel>
            <Sprakvelger />
          </section>
          <Meldekortdetaljer
            aktivtMeldekort={this.props.aktivtMeldekort}
            meldekortdetaljer={meldekortdetaljer}
            typeYtelsePostfix={typeYtelsePostfix}
          />
          <BekreftCheckboksPanel
            className={'bekreftInfo'}
            onChange={() => this.settChecked()}
            checked={meldekortdetaljer.sporsmal.signatur}
            label={hentIntl().formatMessage({ id: 'utfylling.bekreftAnsvar' })}
            feil={feilmelding === '' ? undefined : { feilmelding: feilmelding }}
          >
            <Normaltekst>
              <FormattedHTMLMessage
                id={'utfylling.bekreft' + typeYtelsePostfix}
              />
            </Normaltekst>
          </BekreftCheckboksPanel>
          <section className="seksjon flex-innhold sentrert">
            <div className={'knapper-container'}>
              <NavKnapp
                type={KnappTyper.HOVED}
                nestePath={'/innsending/kvittering'}
                tekstid={'naviger.send'}
                className={'navigasjonsknapp'}
                validering={this.valider}
                spinner={this.state.senderMeldekort}
                disabled={this.state.senderMeldekort}
              />
              <NavKnapp
                type={KnappTyper.STANDARD}
                nestePath={
                  this.hoppOverUtfylling()
                    ? '/innsending/sporsmal'
                    : '/innsending/utfylling'
                }
                tekstid={'naviger.forrige'}
                className={'navigasjonsknapp'}
              />
              <NavKnapp
                type={KnappTyper.FLAT}
                nestePath={'/om-meldekort'}
                tekstid={'naviger.avbryt'}
                className={'navigasjonsknapp'}
              />
            </div>
          </section>
        </main>
      ) : (
        <Redirect exact={true} to="/om-meldekort" />
      );
    }
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
    aktivtMeldekort: state.aktivtMeldekort,
    person: state.person,
    baksystemFeilmelding: selectFeilmelding(state),
    sendteMeldekort: state.meldekort.sendteMeldekort,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterMeldekortdetaljer: (mdetaljer: MDetaljer) =>
      dispatch(InnsendingActions.oppdaterMeldekortdetaljer(mdetaljer)),
    settMeldekortdetaljerInnsending: (
      meldekortdetaljerInnsending: MeldekortdetaljerInnsending
    ) =>
      dispatch(
        InnsendingActions.settMeldekortdetaljerInnsending(
          meldekortdetaljerInnsending
        )
      ),
    kontrollerMeldekort: (
      meldekortdetaljerInnsending: MeldekortdetaljerInnsending
    ) =>
      dispatch(
        InnsendingActions.kontrollerMeldekort.request(
          meldekortdetaljerInnsending
        )
      ),
    skjulBaksystemFeilmelding: () =>
      dispatch(UiActions.skjulBaksystemFeilmelding()),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Bekreftelse);
