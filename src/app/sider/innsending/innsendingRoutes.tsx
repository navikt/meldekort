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
import { Meldekort, Meldekortdetaljer } from '../../types/meldekort';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { RootState } from '../../store/configureStore';
import { Sporsmal as Spm } from './1-sporsmalsside/sporsmal/sporsmalConfig';
import { MeldekortdetaljerActions } from '../../actions/meldekortdetaljer';
import { UtfyltDag } from './2-utfyllingsside/utfylling/utfyltDagConfig';
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

type InnsendingRoutesProps = RouteComponentProps &
  MapStateToProps &
  MapDispatchToProps;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps> {
  settMeldekortIdBasertPaInnsendingstype = () => {
    const {
      hentKorrigertId,
      innsending,
      settMeldekortId,
      aktivtMeldekort,
    } = this.props;
    if (innsending.innsendingstype === Innsendingstyper.KORRIGERING) {
      hentKorrigertId();
      settMeldekortId(aktivtMeldekort.meldekortId);
    } else {
      settMeldekortId(aktivtMeldekort.meldekortId);
    }
  };

  componentDidMount() {
    this.settMeldekortIdBasertPaInnsendingstype();
  }

  render() {
    const { match } = this.props;
    const { pathname } = this.props.router.location;
    const currentPath = `${match.url}`;

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
            path={currentPath + '/sporsmal'}
            render={props => <Sporsmalsside {...props} />}
          />
          <Route
            path={currentPath + '/utfylling'}
            render={(props: RouteComponentProps<any>) => (
              <Utfylling {...props} />
            )}
          />
          <Route
            path={currentPath + '/bekreftelse'}
            render={(props: RouteComponentProps<any>) => (
              <Bekreftelse {...props} />
            )}
          />
          <Route
            path={currentPath + '/kvittering'}
            render={(props: RouteComponentProps<any>) => (
              <Kvittering {...props} />
            )}
          />
          <Redirect
            exact={true}
            from={currentPath}
            to={currentPath + `/sporsmal`}
          />
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
    hentKorrigertId: () =>
      dispatch(InnsendingActions.hentKorrigertId.request()),
    oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
    oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
    hentMeldekortdetaljer: () =>
      dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InnsendingRoutes);
