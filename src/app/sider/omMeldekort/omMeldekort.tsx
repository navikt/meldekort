import * as React from "react";
import Sprakvelger from "../../components/sprakvelger/sprakvelger";
import { InnsendingActions } from "../../actions/innsending";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { formatHtmlMessage, formatMessage } from "../../utils/intlUtil";
import { MenyActions } from "../../actions/meny";
import { MenyPunkt } from "../../utils/menyConfig";
import { MenyState } from "../../types/meny";
import { RootState } from "../../store/configureStore";
import { scrollTilElement } from "../../utils/scroll";
import { loggAktivitet } from "../../utils/amplitudeUtils";
import { BodyLong, GuidePanel, Heading } from "@navikt/ds-react";

interface MapStateToProps {
  meny: MenyState;
}

interface MapDispatchToProps {
  resetInnsending: () => void;
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
}

class OmMeldekort extends React.Component<MapDispatchToProps & MapStateToProps, object> {
  componentDidMount() {
    scrollTilElement(undefined, "auto");
    const { resetInnsending, meny, settValgtMenyPunkt } = this.props;
    resetInnsending();
    const valgtMenyPunkt = meny.alleMenyPunkter.find(
      (mp) => window.location.pathname.endsWith(mp.urlparam)
    );
    if (typeof valgtMenyPunkt !== "undefined") {
      settValgtMenyPunkt(valgtMenyPunkt);
    }
    loggAktivitet("Viser om meldekort");
  }

  render() {
    return (
      <main className="sideinnhold">
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Heading size="large">
            {formatHtmlMessage("overskrift.genereltOmMeldekort")}
          </Heading>
          <Sprakvelger />
        </section>
        <GuidePanel poster>
          <section className="seksjon">
            <BodyLong>
              {formatHtmlMessage("genereltOmMeldekort.velkommen")}
            </BodyLong>
            <BodyLong>
              {formatHtmlMessage("genereltOmMeldekort.velge")}
              <ul>
                <li>
                  {formatHtmlMessage("genereltOmMeldekort.valg.sende")}
                </li>
                <li>
                  {formatHtmlMessage("genereltOmMeldekort.valg.tidligere")}
                </li>
              </ul>
            </BodyLong>
            <BodyLong>
              {formatHtmlMessage(
                "genereltOmMeldekort.om.meldekort",
                {
                  0: "https://www.nav.no",
                  1: formatMessage("genereltOmMeldekort.informasjonOmMeldekortLink").trim(),
                }
              )}
            </BodyLong>
            <BodyLong>
              {formatHtmlMessage("genereltOmMeldekort.oss")}
            </BodyLong>
          </section>
        </GuidePanel>
      </main>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    meny: state.meny,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OmMeldekort);
