import * as React from 'react';
import Bekreftelse from './3-bekreftelsesside/bekreftelse';
import Kvittering from './4-kvitteringsside/kvittering';
import PeriodeBanner from '../../components/periodeBanner/periodeBanner';
import Sporsmalsside from './1-sporsmalsside/sporsmalsside';
import StegBanner from '../../components/stegBanner/stegBanner';
import Utfylling from './2-utfyllingsside/utfyllingsside';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { InnsendingActions } from '../../actions/innsending';
import { InnsendingState, Innsendingstyper } from '../../types/innsending';
import { Meldekort, MeldekortDag, Meldekortdetaljer, Sporsmal } from '../../types/meldekort';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { RootState } from '../../store/configureStore';
import { Sporsmal as Spm } from './1-sporsmalsside/sporsmal/sporsmalConfig';
import { MeldekortdetaljerActions } from '../../actions/meldekortdetaljer';
import { UtfyltDag } from './2-utfyllingsside/utfylling/utfyltDagConfig';
import { hentUkedagerSomStringListe } from '../../utils/ukedager';
import { RouterState } from 'connected-react-router';

interface MapStateToProps {
  innsending: InnsendingState;
  aktivtMeldekort: Meldekort;
  meldekortdetaljer: Meldekortdetaljer;
  router: RouterState;
}

interface MapDispatchToProps {
  hentKorrigertId: () => void;
  hentMeldekortdetaljer: () => void;
  oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) => void;
  oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) => void;
  settMeldekortId: (meldekortId: number) => void;
}

type InnsendingRoutesProps = RouteComponentProps & MapStateToProps & MapDispatchToProps;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps> {
  settMeldekortIdBasertPaInnsendingstype = () => {
    const { hentKorrigertId, innsending, settMeldekortId, aktivtMeldekort } = this.props;
    if (innsending.innsendingstype === Innsendingstyper.korrigering) {
      hentKorrigertId();
      settMeldekortId(aktivtMeldekort.meldekortId);
    } else {
      settMeldekortId(aktivtMeldekort.meldekortId);
    }
  };

  settSporsmalOgUtfyllingHvisKorrigering = () => {
    const { innsending, oppdaterSporsmalsobjekter, oppdaterUtfylteDager } = this.props;
    if (innsending.innsendingstype === Innsendingstyper.korrigering) {
      const konverterteSporsmalsobjekter = this.konverterMeldekortdetaljerSporsmalTilInnsendingSporsmal(
        this.props.meldekortdetaljer.sporsmal,
        innsending.sporsmalsobjekter
      );
      const konverterteUtfylteDager = this.konverterMeldekortdetaljerMeldekortDagerTilInnsendingUtfylteDager(
        this.props.meldekortdetaljer.sporsmal.meldekortDager,
        innsending.utfylteDager
      );
      oppdaterSporsmalsobjekter(konverterteSporsmalsobjekter);
      oppdaterUtfylteDager(konverterteUtfylteDager);
    }
  };

  returnerListeMedMeldekortdetaljerSporsmal = (mkdetaljerSporsmal: Sporsmal) => {
    return [
      { kategori: 'arbeid', checked: mkdetaljerSporsmal.arbeidet },
      { kategori: 'aktivitetArbeid', checked: mkdetaljerSporsmal.kurs },
      { kategori: 'forhindret', checked: mkdetaljerSporsmal.syk },
      { kategori: 'ferieFravar', checked: mkdetaljerSporsmal.annetFravaer },
      { kategori: 'registrert', checked: mkdetaljerSporsmal.arbeidssoker },
    ];
  };

  settCheckedBasertPaBoolean = (kategoritekst: string, sporsmalValg: boolean) => {
    return sporsmalValg ? kategoritekst + '.ja' : kategoritekst + '.nei';
  };

  konverterMeldekortdetaljerMeldekortDagerTilInnsendingUtfylteDager = (
    meldekortDager: MeldekortDag[],
    utfylteDager: UtfyltDag[]
  ) => {
    const ukedagerSomListe = hentUkedagerSomStringListe();
    const konverterteUtfylteDager = utfylteDager.map((utfyltDag, index) => {
      return {
        ...utfyltDag,
        uke: index < 7 ? 1 : 2,
        dag: ukedagerSomListe[index % 7].trim(),
        syk: meldekortDager[index].syk,
        arbeidetTimer: meldekortDager[index].arbeidetTimerSum.toString(),
        annetFravaer: meldekortDager[index].annetFravaer,
        kurs: meldekortDager[index].kurs,
      };
    });
    return konverterteUtfylteDager;
  };

  konverterMeldekortdetaljerSporsmalTilInnsendingSporsmal = (
    mkdetaljerSporsmal: Sporsmal,
    innsendingSporsmal: Spm[]
  ): Spm[] => {
    const listeMedSporsmal = mkdetaljerSporsmal!
      ? this.returnerListeMedMeldekortdetaljerSporsmal(mkdetaljerSporsmal)
      : [];
    const konvertertListeMedInnsendingSpm: Spm[] = innsendingSporsmal.map((spm) => {
      for (let i = 0; i < listeMedSporsmal.length; i++) {
        if (spm.kategori === listeMedSporsmal[i].kategori) {
          return {
            ...spm,
            checked: this.settCheckedBasertPaBoolean(spm.kategori, listeMedSporsmal[i].checked),
          };
        }
      }
      return { ...spm };
    });
    return konvertertListeMedInnsendingSpm;
  };

  componentDidMount() {
    this.settMeldekortIdBasertPaInnsendingstype();
    this.settSporsmalOgUtfyllingHvisKorrigering();
  }

  render() {
    const { match } = this.props;
    const { pathname } = this.props.router.location;

    let noPrint =
      pathname === `/send-meldekort/innsending/kvittering` ||
      pathname === `/tidligere-meldekort/detaljer/korriger/kvittering`
        ? `noPrint`
        : undefined;

    return this.props.innsending.innsendingstype === null ? (
      <Redirect to={'/om-meldekort'} />
    ) : (
      <div className="sideinnhold">
        <PeriodeBanner className={noPrint} />
        <StegBanner />
        <Switch>
          <Route
            exact={true}
            path={`${match.url}` + '/sporsmal'}
            render={(props) => <Sporsmalsside {...props} />}
          />
          <Route
            path={`${match.url}` + '/utfylling'}
            render={(props: RouteComponentProps<any>) => <Utfylling {...props} />}
          />
          <Route
            path={`${match.url}` + '/bekreftelse'}
            render={(props: RouteComponentProps<any>) => <Bekreftelse {...props} />}
          />
          <Route
            path={`${match.url}` + '/kvittering'}
            render={(props: RouteComponentProps<any>) => <Kvittering {...props} />}
          />
          <Redirect exact={true} from={`${match.url}`} to={`${match.url}` + `/sporsmal`} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
    aktivtMeldekort: state.aktivtMeldekort,
    meldekortdetaljer: state.meldekortdetaljer.meldekortdetaljer,
    router: state.router,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settMeldekortId: (meldekortId: number) =>
      dispatch(InnsendingActions.leggTilMeldekortId(meldekortId)),
    hentKorrigertId: () => dispatch(InnsendingActions.hentKorrigertId.request()),
    oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
    oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
    hentMeldekortdetaljer: () => dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InnsendingRoutes);
