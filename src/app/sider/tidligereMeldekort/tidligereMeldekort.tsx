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

import { formatHtmlMessage, hentIntl } from '../../utils/intlUtil';
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
import { SkrivemodusActions } from '../../actions/skrivemodus';
import { Skrivemodus } from '../../types/skrivemodus';
import SkrivemodusInfomelding from '../../components/feil/skrivemodusInfomelding';
import { scrollTilElement } from '../../utils/scroll';
import { loggAktivitet } from '../../utils/amplitudeUtils';
import { Konstanter } from "../../utils/consts";

interface MapStateToProps {
  historiskeMeldekort: HistoriskeMeldekortState;
  ingenTidligereMeldekort: IngenTidligereMeldekort;
  baksystemFeilmelding: BaksystemFeilmelding;
  skrivemodus: Skrivemodus;
  meny: MenyState;
}

interface MapDispatchToProps {
  hentHistoriskeMeldekort(): void;
  resetInnsending(): void;
  hentSkrivemodus(): void;
  settValgtMenyPunkt(menypunkt: MenyPunkt): void;
}

type State = {
  windowSize: number;
};

type Props = MapDispatchToProps & MapStateToProps;

class TidligereMeldekort extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.hentHistoriskeMeldekort();
    this.props.hentSkrivemodus()
    this.state = {
      windowSize: window.innerWidth,
    };
  }

  hentRaderFraHistoriskeMeldekort = () => {
    const radliste: HistoriskeMeldekortRad[] = [];

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
        detaljer: hentIntl().formatMessage({ id: "overskrift.detaljer" }),
      });
    });
    return radliste;
  };

  hentTabell = () => {
    const rows = this.hentRaderFraHistoriskeMeldekort();

    const columns = [
      {
        key: 'periode',
        label: formatHtmlMessage("overskrift.periode"),
        cell: function(row: HistoriskeMeldekortRad) { // (row: any, columnKey: any)
          if (row.meldekort.kortStatus === KortStatus.UBEHA) {
            return row.periode;
          }
          return (
            <Komponentlenke
              lenketekst={row.periode}
              rute={Konstanter.basePath + "/tidligere-meldekort/detaljer"}
              meldekort={row.meldekort}
            />
          );
        },
      },
      {
        key: 'dato',
        label: formatHtmlMessage("overskrift.dato"),
        cell: 'dato',
      },
      {
        key: 'mottatt',
        label: formatHtmlMessage("overskrift.mottatt"),
        cell: 'mottatt',
      },
      {
        key: 'status',
        label: formatHtmlMessage("overskrift.status"),
        cell: function(row: HistoriskeMeldekortRad) { // (row: any, columnKey: any)
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
        label: formatHtmlMessage("overskrift.bruttoBelop"),
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
          {formatHtmlMessage("tidligereMeldekort.harIngen")}
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
    this.props.hentSkrivemodus();
    if (this.props.skrivemodus.skrivemodus) {
      this.props.hentHistoriskeMeldekort();
    }
    const valgtMenyPunkt = this.props.meny.alleMenyPunkter.find(
      (mp) => window.location.pathname.endsWith(mp.urlparam)
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
          {formatHtmlMessage("tidligereMeldekort.forklaring")}
        </section>
        <section className="seksjon">
          {formatHtmlMessage("tidligereMeldekort.forklaring.korrigering")}
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
            {formatHtmlMessage("overskrift.tidligereMeldekort")}
          </Innholdstittel>
          <Sprakvelger />
        </section>
        {this.props.skrivemodus.skrivemodus ? (
          this.tekstOgContent()
        ) : (
          <SkrivemodusInfomelding skrivemodus={this.props.skrivemodus} />
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
    skrivemodus: state.skrivemodus,
    meny: state.meny,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentHistoriskeMeldekort: () =>
      dispatch(HistoriskeMeldekortActions.hentHistoriskeMeldekort.request()),
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    hentSkrivemodus: () =>
      dispatch(SkrivemodusActions.hentSkrivemodus.request()),
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
  };
};

export default connect<MapStateToProps, MapDispatchToProps, object>(mapStateToProps, mapDispatchToProps)(TidligereMeldekort);
