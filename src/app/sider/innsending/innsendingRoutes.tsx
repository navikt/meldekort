import * as React from "react";
import Bekreftelse from "./3-bekreftelsesside/bekreftelse";
import Kvittering from "./4-kvitteringsside/kvittering";
import PeriodeBanner from "../../components/periodeBanner/periodeBanner";
import Sporsmalsside from "./1-sporsmalsside/sporsmalsside";
import StegBanner from "../../components/stegBanner/stegBanner";
import Utfylling from "./2-utfyllingsside/utfyllingsside";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { InnsendingActions } from "../../actions/innsending";
import { InnsendingState, Innsendingstyper } from "../../types/innsending";
import { Meldekort, Meldekortdetaljer } from "../../types/meldekort";
import { Location, Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { RootState } from "../../store/configureStore";
import { Sporsmal as Spm } from "./1-sporsmalsside/sporsmal/sporsmalConfig";
import { MeldekortdetaljerActions } from "../../actions/meldekortdetaljer";
import { UtfyltDag } from "./2-utfyllingsside/utfylling/utfyltDagConfig";
import { downloadMessagesAndDispatch } from "../../utils/intlUtil";
import { hentKorrigertIdAndDispatch } from "../../utils/korrigeringUtils";
import { Konstanter } from "../../utils/consts";

interface MapStateToProps {
  innsending: InnsendingState;
  aktivtMeldekort: Meldekort;
  meldekortdetaljer: Meldekortdetaljer;
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
  location: Location;
}

type InnsendingRoutesProps = RouteProps &
  MapStateToProps &
  MapDispatchToProps &
  Props;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps, object> {
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
    const { location, innsending } = this.props;
    const { pathname } = location;

    const noPrint =
      pathname === `/send-meldekort/innsending/kvittering` ||
      pathname === `/tidligere-meldekort/detaljer/korriger/kvittering`
        ? "noPrint"
        : "";

    return innsending.innsendingstype === null ? (
      <Navigate to={Konstanter.basePath + "/om-meldekort"} replace />
    ) : (
      <div className="sideinnhold">
        <PeriodeBanner className={noPrint} />
        <StegBanner />
        <Routes>
          <Route  path={"sporsmal"} element={<Sporsmalsside />} />
          <Route path={"utfylling"} element={<Utfylling />} />
          <Route path={"bekreftelse"} element={<Bekreftelse />} />
          <Route path={"kvittering"} element={<Kvittering location={location} />} />
          <Route path={"/"} element={<Navigate to={`sporsmal`} replace />} />
        </Routes>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
    aktivtMeldekort: state.aktivtMeldekort,
    meldekortdetaljer: state.meldekortdetaljer.meldekortdetaljer,
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
