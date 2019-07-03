import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import BegrunnelseVelger from './begrunnelse/begrunnelseVelger';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import SporsmalsGruppe from './sporsmal/sporsmalsGruppe';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import veileder from '../../../ikoner/veileder.svg';
import Veilederpanel from 'nav-frontend-veilederpanel';
import { UtfyltDag } from '../2-utfyllingsside/utfylling/utfyltDagConfig';
import { Begrunnelse, InnsendingState, Innsendingstyper, SpmSvar } from '../../../types/innsending';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { hentIntl } from '../../../utils/intlUtil';
import { history, RootState } from '../../../store/configureStore';
import { ikkeFortsetteRegistrertContent } from '../../../components/modal/ikkeFortsetteRegistrertContent';
import { IModal, ModalKnapp } from '../../../types/ui';
import { Innholdstittel } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../../actions/innsending';
import { Meldegruppe, Meldekort, SendtMeldekort } from '../../../types/meldekort';
import { Redirect, RouteComponentProps } from 'react-router';
import { scrollTilElement } from '../../../utils/scroll';
import { Sporsmal } from './sporsmal/sporsmalConfig';
import { UiActions } from '../../../actions/ui';
import { erAktivtMeldekortGyldig } from '../../../utils/meldekortUtils';

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
  innsending: InnsendingState;
  sendteMeldekort: SendtMeldekort[];
}

interface MapDispatchToProps {
  oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
  skjulModal: () => void;
  resetSporsmalOgUtfylling: () => void;
  visModal: (modal: IModal) => void;
  settBegrunnelse: (begrunnelse: Begrunnelse) => void;
  oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps & RouteComponentProps;

const kategorier = ['arbeid', 'aktivitetArbeid', 'forhindret', 'ferieFravar', 'registrert'];

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
  valider = (): boolean => {
    const { sporsmalsobjekter, begrunnelse, innsendingstype } = this.props.innsending;

    const arbeidet = this.sjekkOmSporsmalErUtfylt(kategorier[0]);
    const kurs = this.sjekkOmSporsmalErUtfylt(kategorier[1]);
    const syk = this.sjekkOmSporsmalErUtfylt(kategorier[2]);
    const ferie = this.sjekkOmSporsmalErUtfylt(kategorier[3]);
    const registrert = this.sjekkOmSporsmalErUtfylt(kategorier[4]);
    const begrunnelseValgt =
      begrunnelse.valgtArsak === '' && innsendingstype === Innsendingstyper.korrigering;
    const nySporsmalsobjekterState = sporsmalsobjekter.map(sporsmalsobj => {
      switch (sporsmalsobj.kategori) {
        case kategorier[0]:
          return {
            ...sporsmalsobj,
            feil: { erFeil: !arbeidet, feilmeldingId: sporsmalsobj.feil.feilmeldingId },
          };
        case kategorier[1]:
          return {
            ...sporsmalsobj,
            feil: { erFeil: !kurs, feilmeldingId: sporsmalsobj.feil.feilmeldingId },
          };
        case kategorier[2]:
          return {
            ...sporsmalsobj,
            feil: { erFeil: !syk, feilmeldingId: sporsmalsobj.feil.feilmeldingId },
          };
        case kategorier[3]:
          return {
            ...sporsmalsobj,
            feil: { erFeil: !ferie, feilmeldingId: sporsmalsobj.feil.feilmeldingId },
          };
        case kategorier[4]:
          return {
            ...sporsmalsobj,
            feil: { erFeil: !registrert, feilmeldingId: sporsmalsobj.feil.feilmeldingId },
          };
        default:
          return { ...sporsmalsobj };
      }
    });
    this.props.oppdaterSvar(nySporsmalsobjekterState);
    this.props.settBegrunnelse({
      valgtArsak: begrunnelse.valgtArsak,
      erFeil: begrunnelseValgt,
    });

    const resultat = arbeidet && kurs && syk && ferie && registrert && !begrunnelseValgt;
    if (!resultat) {
      scrollTilElement('feilmelding');
      return resultat;
    }

    if (!this.fortsetteRegistrert()) {
      this.props.visModal({
        content: () => ikkeFortsetteRegistrertContent(),
        knapper: this.ikkeFortsetteRegistrertKnapper(),
        visModal: true,
      });
      return false;
    }

    this.resetEndredeKategorier();

    return resultat;
  };

  resetEndredeKategorier() {
    let arbeidet: boolean,
      kurs: boolean,
      syk: boolean,
      ferie: boolean = true;
    this.hentSvarPaaSporsmal().map(spm => {
      switch (spm.kategori) {
        case kategorier[0]:
          arbeidet = spm.svar;
          break;
        case kategorier[1]:
          kurs = spm.svar;
          break;
        case kategorier[2]:
          syk = spm.svar;
          break;
        case kategorier[3]:
          ferie = spm.svar;
          break;
        default:
          break;
      }
    });
    let oppdatertUtfylteDager = this.props.innsending.utfylteDager.map(utfyltDag => {
      return {
        ...utfyltDag,
        arbeidetTimer: arbeidet ? utfyltDag.arbeidetTimer : undefined,
        kurs: kurs ? utfyltDag.kurs : false,
        syk: syk ? utfyltDag.syk : false,
        annetFravaer: ferie ? utfyltDag.annetFravaer : false,
      };
    });
    this.props.oppdaterDager(oppdatertUtfylteDager);
  }

  hentSvarPaaSporsmal = (): SpmSvar[] => {
    let sporsmalListe: SpmSvar[] = [];
    this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
      sporsmalListe.push({
        kategori: sporsmalobj.kategori,
        svar: sporsmalobj.checked === undefined ? false : sporsmalobj.checked.endsWith('ja'),
      });
    });
    return sporsmalListe;
  };

  fortsetteRegistrert = (): boolean => {
    const sporsmal = this.hentSvarPaaSporsmal().filter(spm => spm.kategori === kategorier[4]);
    if (sporsmal.length !== 0) {
      return sporsmal[0].svar;
    }
    return false;
  };

  hentSporsmal = (): SpmSvar[] => {
    let sporsmalListe: SpmSvar[] = [];

    this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
      sporsmalListe.push({
        kategori: sporsmalobj.kategori,
        svar: typeof sporsmalobj.checked !== 'undefined',
      });
    });
    return sporsmalListe;
  };

  sjekkOmSporsmalErUtfylt = (kategori: string): boolean => {
    const sporsmalListe = this.hentSporsmal();
    const sporsmal = sporsmalListe.filter(spm => spm.kategori === kategori);
    if (sporsmal.length !== 0) {
      return sporsmal[0].svar;
    }
    return false;
  };

  hentFeilmeldinger = (aap: boolean) => {
    const { sporsmalsobjekter, begrunnelse, innsendingstype } = this.props.innsending;
    const feilIArbeid = sporsmalsobjekter[0].feil.erFeil;
    const feillIKurs = sporsmalsobjekter[1].feil.erFeil;
    const feilISyk = sporsmalsobjekter[2].feil.erFeil;
    const feilIFerie = sporsmalsobjekter[3].feil.erFeil;
    const feilIRegistrert = sporsmalsobjekter[4].feil.erFeil;
    const feilIBegrunnelse = begrunnelse.erFeil && innsendingstype === Innsendingstyper.korrigering;

    if (
      feilIArbeid ||
      feillIKurs ||
      feilISyk ||
      feilIFerie ||
      feilIRegistrert ||
      feilIBegrunnelse
    ) {
      return (
        <AlertStripe type={'feil'}>
          <ul>
            {feilIBegrunnelse ? (
              <li>{`${hentIntl().formatMessage({ id: 'begrunnelse.required' })}`}</li>
            ) : null}
            {feilIArbeid ? (
              <li>{`${hentIntl().formatMessage({ id: 'arbeidet.required' })}`}</li>
            ) : null}
            {feillIKurs ? (
              <li>{`${hentIntl().formatMessage({
                id: 'kurs.required' + (aap ? '-AAP' : ''),
              })}`}</li>
            ) : null}
            {feilISyk ? (
              <li>{`${hentIntl().formatMessage({ id: 'syk.required' + (aap ? '-AAP' : '') })}`}</li>
            ) : null}
            {feilIFerie ? (
              <li>{`${hentIntl().formatMessage({
                id: 'annetFravar.required' + (aap ? '-AAP' : ''),
              })}`}</li>
            ) : null}
            {feilIRegistrert ? (
              <li>{`${hentIntl().formatMessage({ id: 'fortsetteRegistrert.required' })}`}</li>
            ) : null}
          </ul>
        </AlertStripe>
      );
    }
  };

  hoppeOverUtfylling = (): boolean => {
    let jaSvar = false;
    this.hentSvarPaaSporsmal().map(spm => {
      if (spm.kategori !== kategorier[4] && spm.svar && !jaSvar) {
        jaSvar = true;
      }
    });
    return !jaSvar;
  };

  resetSporsmalOgUtfyllingHvisAktivtMeldekortIdIkkeErLikInnsendingMeldekortId = () => {
    const { aktivtMeldekort, innsending, resetSporsmalOgUtfylling } = this.props;
    if (aktivtMeldekort.meldekortId !== innsending.meldekortId) {
      resetSporsmalOgUtfylling();
    }
  };

  componentDidMount() {
    scrollTilElement(undefined, 'auto');
    this.resetSporsmalOgUtfyllingHvisAktivtMeldekortIdIkkeErLikInnsendingMeldekortId();
    if (this.props.innsending.innsendingstype === Innsendingstyper.etterregistrering) {
      const nySporsmalsobjektState = this.props.innsending.sporsmalsobjekter.map(spmObj => {
        if (spmObj.kategori === kategorier[4]) {
          return { ...spmObj, checked: kategorier[4] + '.ja' };
        } else {
          return { ...spmObj };
        }
      });
      this.props.oppdaterSvar(nySporsmalsobjektState);
    }
  }

  render() {
    const { innsending, aktivtMeldekort, sendteMeldekort } = this.props;
    const meldegruppeErAAP = aktivtMeldekort.meldegruppe === Meldegruppe.ATTF;
    const brukermelding = hentIntl().formatMessage({ id: 'meldekort.bruker.melding' });
    return erAktivtMeldekortGyldig(aktivtMeldekort, sendteMeldekort, innsending.innsendingstype) ? (
      <main>
        <section className="seksjon flex-innhold sentrert">
          {brukermelding.length > 1 ? (
            <AlertStripe type={'info'}>{brukermelding}</AlertStripe>
          ) : null}
        </section>
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Innholdstittel>
            <FormattedMessage id="overskrift.steg1" />
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <section className="seksjon">
          <Veilederpanel kompakt={true} svg={<img alt="Veilder" src={veileder} />}>
            <div className="item">
              <FormattedMessage id="sporsmal.lesVeiledning" />
            </div>
            <div className="item">
              <FormattedMessage id="sporsmal.ansvarForRiktigUtfylling" />
            </div>
          </Veilederpanel>
        </section>
        <section id="feilmelding" className="seksjon">
          {this.hentFeilmeldinger(meldegruppeErAAP)}
        </section>
        {innsending.innsendingstype === Innsendingstyper.korrigering && (
          <section className="seksjon">
            <BegrunnelseVelger AAP={meldegruppeErAAP} erFeil={innsending.begrunnelse.erFeil} />
          </section>
        )}
        <section className="seksjon">
          <SporsmalsGruppe AAP={meldegruppeErAAP} innsending={innsending} />
          {innsending.innsendingstype === Innsendingstyper.innsending ? (
            <AlertStripe type="advarsel">
              <FormattedHTMLMessage id="sporsmal.registrertMerknad" />
            </AlertStripe>
          ) : null}
        </section>
        <section className="seksjon flex-innhold sentrert">
          <div className={'knapper-container'}>
            <NavKnapp
              type={knappTyper.hoved}
              nestePath={this.hoppeOverUtfylling() ? '/bekreftelse' : '/utfylling'}
              tekstid={'naviger.neste'}
              className={'navigasjonsknapp'}
              validering={this.valider}
            />
            <NavKnapp
              type={knappTyper.flat}
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

  ikkeFortsetteRegistrertKnapper = (): ModalKnapp[] => {
    return [
      {
        action: () => {
          history.push(
            '/send-meldekort/innsending/' +
              (this.hoppeOverUtfylling() ? 'bekreftelse' : 'utfylling')
          );
          this.props.skjulModal();
        },
        label: hentIntl().formatMessage({ id: 'overskrift.bekreftOgFortsett' }),
        type: 'hoved',
      },
      {
        action: () => {
          this.props.skjulModal();
        },
        label: hentIntl().formatMessage({ id: 'sporsmal.tilbakeEndre' }),
        type: 'standard',
      },
    ];
  };
}

// TODO: Bytt til å hente meldekortDetaljer fra Store
const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
    innsending: state.innsending,
    sendteMeldekort: state.meldekort.sendteMeldekort,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
    skjulModal: () => dispatch(UiActions.skjulModal()),
    visModal: (modal: IModal) => dispatch(UiActions.visModal(modal)),
    resetSporsmalOgUtfylling: () => dispatch(InnsendingActions.resetSporsmalOgUtfylling()),
    settBegrunnelse: (begrunnelsesobj: Begrunnelse) =>
      dispatch(InnsendingActions.settBegrunnelse(begrunnelsesobj)),
    oppdaterDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(Sporsmalsside);
