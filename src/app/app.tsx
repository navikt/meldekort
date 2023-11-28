import * as React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootState } from "./store/configureStore";
import Header from "./components/header/header";
import MeldekortRoutes from "./sider/meldekortRoutes";
import setupMock from "./mock/setup-mock";
import { Dispatch } from "redux";
import { erMock } from "./mock/utils";
import { MeldeForm, Person } from "./types/person";
import { PersonStatusActions } from "./actions/personStatus";
import { PersonStatusState } from "./reducers/personStatusReducer";
import { connect } from "react-redux";
import Feilside from "./components/feilside/feilside";
import { BaksystemFeilmelding } from "./types/ui";
import { selectFeilmelding } from "./selectors/ui";
import UIAlertstripeWrapper from "./components/feil/UIAlertstripeWrapper";
import { MenyState } from "./types/meny";
import { MenyPunkt } from "./utils/menyConfig";
import { MenyActions } from "./actions/meny";
import { formatMessage } from "./utils/intlUtil";
import classNames from "classnames";
import { PersonActions } from "./actions/person";
import { erBrukerRegistrertIArena } from "./utils/meldekortUtils";
import { isIE, isOldChrome, isOldEdge, isOldFirefox, isOldIE, isOldSafari } from "./utils/browsers";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Konstanter } from "./utils/consts";
import { Loader } from "@navikt/ds-react";

if (erMock()) {
  setupMock();
}

interface MapStateToProps {
  personStatus: PersonStatusState;
  baksystemFeilmelding: BaksystemFeilmelding;
  person: Person;
  meny: MenyState;
}

interface MapDispatchToProps {
  hentPerson: () => void;
  hentPersonStatus: () => void;
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
  settMenyPunkter: (menypunkter: MenyPunkt[]) => void;
  toggleMeny: (erApen: boolean) => void;
}

type Props = MapStateToProps & MapDispatchToProps & WrappedComponentProps;

interface AppState {
  henterPersonInfo: boolean;
}

class App extends React.Component<Props, AppState> {
  constructor(props: Props) {
    super(props);
    this.state = { henterPersonInfo: false };
    this.props.hentPersonStatus();
  }

  settInnhold = () => {
    const {
      personStatus,
      baksystemFeilmelding,
      person,
      hentPerson,
      meny,
      toggleMeny,
    } = this.props;

    if (personStatus.personStatus.id === "") {
      return (
        <div className="main-container">
          {baksystemFeilmelding.visFeilmelding ? (
            <UIAlertstripeWrapper />
          ) : personStatus.personStatus.statusArbeidsoker ===
            "venter_pa_data" ? (
            <Loader size="xlarge" />
          ) : (
            <Feilside />
          )}
        </div>
      );
    } else if (
      erBrukerRegistrertIArena(
        personStatus?.personStatus.statusArbeidsoker || ""
      )
    ) {
      if (
        person.meldeform === MeldeForm.IKKE_SATT &&
        !this.state.henterPersonInfo
      ) {
        hentPerson();
        this.setState({ henterPersonInfo: true });
      }

      const browserSpecificStyling = classNames("main-container", {
        partialGridSupportedStyling: isIE || isOldEdge,
        oldBrowserStyling:
          isOldSafari || isOldChrome || isOldIE || isOldFirefox,
      });

      return (
        <BrowserRouter>
          <Header tittel={formatMessage("overskrift.meldekort")} />
          <div
            className={classNames("", { overlay: meny.erApen })}
            onClick={() => meny.erApen && toggleMeny(!meny.erApen)}
          >
            <div className={browserSpecificStyling}>
              <Routes>
                <Route path={Konstanter.basePath + "/*"} element={<MeldekortRoutes />} />
                <Route path="/" element={<Navigate to={Konstanter.basePath} replace />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      );
    } else {
      return (
        <div className="main-container">
          <Feilside />
        </div>
      );
    }
  };

  componentDidMount() {
    const { meny, hentPersonStatus, settValgtMenyPunkt } = this.props;
    const valgtMenyPunkt = meny.alleMenyPunkter.find(
      (mp) => window.location.pathname.endsWith(mp.urlparam)
    );
    if (typeof valgtMenyPunkt !== "undefined") {
      settValgtMenyPunkt(valgtMenyPunkt);
    }
    hentPersonStatus();
  }

  public render() {
    return (
      <>
        {this.settInnhold()}
      </>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    personStatus: state.personStatus,
    person: state.person,
    baksystemFeilmelding: selectFeilmelding(state),
    meny: state.meny,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    hentPersonStatus: () =>
      dispatch(PersonStatusActions.hentPersonStatus.request()),
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
    settMenyPunkter: (menypunkter: MenyPunkt[]) =>
      dispatch(MenyActions.settAktiveMenyPunkter(menypunkter)),
    toggleMeny: (erApen: boolean) => dispatch(MenyActions.toggleMeny(erApen)),
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(App));
