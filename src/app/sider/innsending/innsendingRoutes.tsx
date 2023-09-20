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
import { downloadMessagesAndDispatch } from '../../utils/intlUtil';
import { hentKorrigertIdAndDispatch } from '../../utils/korrigeringUtils';
import { Location } from 'history';

interface MapStateToProps {
  innsending: InnsendingState;
  aktivtMeldekort: Meldekort;
  meldekortdetaljer: Meldekortdetaljer;
  router: RouterState;
  locale: string;
}

interface MapDispatchToProps {
  hentKorrigertId: () => void;
  hentMeldekortdetaljer: () => void;
  oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) => void;
  oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) => void;
  settMeldekortId: (meldekortId: number) => void;
  settLocale: (locale: string, from: Date) => void;
}

interface Props {
  match: any;
  history: any;
  location: Location;
}

type InnsendingRoutesProps = RouteComponentProps &
  MapStateToProps &
  MapDispatchToProps &
  Props;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps, {}> {
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
    const { settLocale, aktivtMeldekort, locale } = this.props;
    this.settMeldekortIdBasertPaInnsendingstype();
    settLocale(locale, aktivtMeldekort.meldeperiode.fra);
  }

  render() {
    const { match, location, innsending } = this.props;
    const { pathname } = location;
    const currentPath = `${match.url}`;

    let noPrint =
      pathname === `/send-meldekort/innsending/kvittering` ||
      pathname === `/tidligere-meldekort/detaljer/korriger/kvittering`
        ? 'noPrint'
        : '';

    return innsending.innsendingstype === null ? (
      <Redirect to={'/om-meldekort'} />
    ) : (
      <div className="sideinnhold">
        <PeriodeBanner className={noPrint} />
        <StegBanner />
        <Switch>
          <Route
            exact={true}
            path={currentPath + '/sporsmal'}
            children={<Sporsmalsside />}
          />
          <Route path={currentPath + '/utfylling'} children={<Utfylling />} />
          <Route
            path={currentPath + '/bekreftelse'}
            children={<Bekreftelse />}
          />
          <Route
            path={currentPath + '/kvittering'}
            children={({ match, history, location }) => (
              <Kvittering match={match} history={history} location={location} />
            )}
          />
          <Route
            path={currentPath}
            render={() => <Redirect to={currentPath + `/sporsmal`} />}
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
    locale: state.intl.locale,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settMeldekortId: (meldekortId: number) =>
      dispatch(InnsendingActions.leggTilMeldekortId(meldekortId)),
    settLocale: (locale: string, from: Date) => {
      downloadMessagesAndDispatch(locale, from);
    },
    hentKorrigertId: () => hentKorrigertIdAndDispatch(),
    oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
    oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
    hentMeldekortdetaljer: () =>
      dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InnsendingRoutes);
