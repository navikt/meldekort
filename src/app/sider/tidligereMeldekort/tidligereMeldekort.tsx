import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import EtikettBase from 'nav-frontend-etiketter';
import Komponentlenke from '../../components/komponentlenke/komponentlenke';
import MobilTabell from '../../components/tabell/mobil/mobilTabell';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/desktop/tabell';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding, IngenTidligereMeldekort } from '../../types/ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { finnRiktigEtikettKlasse } from '../../utils/statusEtikettUtil';
import { formaterBelop } from '../../utils/numberFormat';
import {
  formaterDato,
  hentDatoPeriode,
  hentUkePeriode,
} from '../../utils/dates';
import { MenyPunkt } from '../../utils/menyConfig';
import { MenyActions } from '../../actions/meny';
import { MenyState } from '../../types/meny';

import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { hentIntl } from '../../utils/intlUtil';
import { HistoriskeMeldekortActions } from '../../actions/historiskeMeldekort';
import { HistoriskeMeldekortState } from '../../reducers/historiskeMeldekortReducer';
import { Innholdstittel } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../actions/innsending';
import { mapKortStatusTilTekst } from '../../utils/kortMapper';
import { HistoriskeMeldekortRad, KortStatus } from '../../types/meldekort';
import { RootState } from '../../store/configureStore';
import {
  selectFeilmelding,
  selectIngenTidligereMeldekort,
} from '../../selectors/ui';
import { WeblogicActions } from '../../actions/skrivemodus';
import { Skrivemodus } from '../../types/skrivemodus';
import WeblogicErNedeInfomelding from '../../components/feil/weblogicErNedeInfomelding';
import { scrollTilElement } from '../../utils/scroll';
import { loggAktivitet } from '../../utils/amplitudeUtils';

interface MapStateToProps {
  historiskeMeldekort: HistoriskeMeldekortState;
  ingenTidligereMeldekort: IngenTidligereMeldekort;
  baksystemFeilmelding: BaksystemFeilmelding;
  weblogic: Skrivemodus;
  meny: MenyState;
}

interface MapDispatchToProps {
  hentHistoriskeMeldekort: () => void;
  resetInnsending: () => void;
  pingWeblogic: () => void;
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
}

type State = {
  windowSize: number;
};

type Props = MapDispatchToProps & MapStateToProps;

class TidligereMeldekort extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.props.hentHistoriskeMeldekort();
    this.props.pingWeblogic();
    this.state = {
      windowSize: window.innerWidth,
    };
  }

  hentRaderFraHistoriskeMeldekort = () => {
    let radliste: HistoriskeMeldekortRad[] = [];

    this.props.historiskeMeldekort.historiskeMeldekort.forEach(meldekort => {
      radliste.push({
        meldekort: meldekort,
        periode: hentUkePeriode(
          meldekort.meldeperiode.fra,
          meldekort.meldeperiode.til
        ),
        dato: hentDatoPeriode(
          meldekort.meldeperiode.fra,
          meldekort.meldeperiode.til
        ),
        mottatt:
          typeof meldekort.mottattDato === 'undefined'
            ? ''
            : formaterDato(meldekort.mottattDato),
        status: meldekort.kortStatus,
        bruttobelop: formaterBelop(meldekort.bruttoBelop),
        detaljer: hentIntl().formatMessage({ id: 'overskrift.detaljer' }),
      });
    });
    return radliste;
  };

  hentTabell = () => {
    const rows = this.hentRaderFraHistoriskeMeldekort();

    const columns = [
      {
        key: 'periode',
        label: <FormattedMessage id="overskrift.periode" />,
        cell: function(row: any, column: any) {
          if (row.meldekort.kortStatus === KortStatus.UBEHA) {
            return row.periode;
          }
          return (
            <Komponentlenke
              lenketekst={row.periode}
              rute="/tidligere-meldekort/detaljer"
              meldekort={row.meldekort}
            />
          );
        },
      },
      {
        key: 'dato',
        label: <FormattedMessage id="overskrift.dato" />,
        cell: 'dato',
      },
      {
        key: 'mottatt',
        label: <FormattedMessage id="overskrift.mottatt" />,
        cell: 'mottatt',
      },
      {
        key: 'status',
        label: <FormattedMessage id="overskrift.status" />,
        cell: function(row: any, columnKey: any) {
          return (
            <EtikettBase
              className={finnRiktigEtikettKlasse(row.status)}
              type={'info'}
            >
              {mapKortStatusTilTekst(row.status)}
            </EtikettBase>
          );
        },
      },
      {
        key: 'bruttobelop',
        label: <FormattedMessage id="overskrift.bruttoBelop" />,
        cell: 'bruttobelop',
      },
    ];

    const erDesktopEllerTablet = this.state.windowSize > 768;

    return erDesktopEllerTablet ? (
      <Tabell rows={rows} columns={columns} />
    ) : (
      <MobilTabell rows={rows} columns={columns} />
    );
  };

  content = () => {
    if (!this.props.ingenTidligereMeldekort.harTidligereMeldekort) {
      return (
        <AlertStripe type={'advarsel'}>
          <FormattedHTMLMessage id="tidligereMeldekort.harIngen" />
        </AlertStripe>
      );
    } else if (this.props.historiskeMeldekort.historiskeMeldekort.length > 0) {
      return this.hentTabell();
    } else {
      return (
        <div className="meldekort-spinner">
          <NavFrontendSpinner type="XL" />
        </div>
      );
    }
  };

  handleWindowSize = () =>
    this.setState({
      windowSize: window.innerWidth,
    });

  componentDidMount() {
    scrollTilElement(undefined, 'auto');
    this.props.resetInnsending();
    this.props.pingWeblogic();
    if (this.props.weblogic.skrivemodus) {
      this.props.hentHistoriskeMeldekort();
    }
    const valgtMenyPunkt = this.props.meny.alleMenyPunkter.find(
      mp => mp.urlparam === window.location.pathname.slice(10)
    );
    if (typeof valgtMenyPunkt !== 'undefined') {
      this.props.settValgtMenyPunkt(valgtMenyPunkt);
    }
    window.addEventListener('resize', this.handleWindowSize);
    loggAktivitet('Viser tidligere meldekort');
  }

  tekstOgContent = () => {
    return (
      <div>
        <section className="seksjon">
          <FormattedMessage id="tidligereMeldekort.forklaring" />
        </section>
        <section className="seksjon">
          <FormattedMessage id="tidligereMeldekort.forklaring.korrigering" />
        </section>
        <section className="seksjon">
          {this.props.baksystemFeilmelding.visFeilmelding ? (
            <UIAlertstripeWrapper />
          ) : (
            this.content()
          )}
        </section>
      </div>
    );
  };

  render() {
    return (
      <main className="sideinnhold">
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Innholdstittel>
            <FormattedMessage id="overskrift.tidligereMeldekort" />
          </Innholdstittel>
          <Sprakvelger />
        </section>
        {this.props.weblogic.skrivemodus ? (
          this.tekstOgContent()
        ) : (
          <WeblogicErNedeInfomelding weblogic={this.props.weblogic} />
        )}
      </main>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    historiskeMeldekort: state.historiskeMeldekort,
    ingenTidligereMeldekort: selectIngenTidligereMeldekort(state),
    baksystemFeilmelding: selectFeilmelding(state),
    weblogic: state.weblogic,
    meny: state.meny,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentHistoriskeMeldekort: () =>
      dispatch(HistoriskeMeldekortActions.hentHistoriskeMeldekort.request()),
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    pingWeblogic: () => dispatch(WeblogicActions.pingWeblogic.request()),
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TidligereMeldekort);
