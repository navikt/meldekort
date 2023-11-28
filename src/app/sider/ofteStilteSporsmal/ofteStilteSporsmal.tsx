import * as React from "react";
import { Innholdstittel } from "nav-frontend-typografi";
import Sprakvelger from "../../components/sprakvelger/sprakvelger";
import { formatHtmlMessage, formatMessage } from "../../utils/intlUtil";

import sporrende from "../../ikoner/sporrende.svg";
import { InnsendingActions } from "../../actions/innsending";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { loggAktivitet } from "../../utils/amplitudeUtils";
import { Accordion } from "@navikt/ds-react";

interface SporsmalProps {
  overskriftId: string;
  tekstId: string;
  id: number;
}

interface SporsmalVisningState {
  valgtSporsmalId: number;
}

interface MapDispatchToProps {
  resetInnsending: () => void;
}

class OfteStilteSporsmal extends React.Component<
  MapDispatchToProps,
  SporsmalVisningState
> {
  constructor(props: MapDispatchToProps) {
    super(props);
    this.state = { valgtSporsmalId: 0 };
  }

  sporsmal = (): SporsmalProps[] => {
    return [
      {
        overskriftId: "oss.sende.overskrift",
        tekstId: "oss.sende.tekst",
        id: 1,
      },
      {
        overskriftId: "oss.frist.overskrift",
        tekstId: "oss.frist.tekst",
        id: 2,
      },
      {
        overskriftId: "oss.korrigere.overskrift",
        tekstId: "oss.korrigere.tekst",
        id: 3,
      },
      {
        overskriftId: "oss.pengene.overskrift",
        tekstId: "oss.pengene.tekst",
        id: 4,
      },
      {
        overskriftId: "oss.utbetalt.overskrift",
        tekstId: "oss.utbetalt.tekst",
        id: 5,
      },
    ];
  };

  hentFormatertOverskrift = (id: string): string => {
    return formatMessage(id);
  };

  componentDidMount() {
    this.props.resetInnsending();
    loggAktivitet("Viser ofte stilte spørsmål");
  }

  render() {
    return (
      <main className="sideinnhold">
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Innholdstittel>
            {formatHtmlMessage("overskrift.ofteStilteSporsmal")}
          </Innholdstittel>
          <Sprakvelger />
        </section>

        <img className="oss-ikon" alt="" src={sporrende} />
        <section className="oss-seksjon seksjon">
          <Accordion>
            {this.sporsmal().map(sporsmal => {
              return (
                  <Accordion.Item key={sporsmal.id}>
                    <Accordion.Header>
                      {this.hentFormatertOverskrift(sporsmal.overskriftId)}
                    </Accordion.Header>
                    <Accordion.Content>
                      {formatHtmlMessage(sporsmal.tekstId)}
                    </Accordion.Content>
                  </Accordion.Item>
              );
            })}
          </Accordion>
        </section>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
  };
};

export default connect(null, mapDispatchToProps)(OfteStilteSporsmal);
