import * as React from "react";
import { Input } from "nav-frontend-skjema";
import {
  hentUkedagerSomStringListe,
  konverterUkedag,
  matchUkedager
} from "../../../../../utils/ukedager";
import { FormattedHTMLMessage } from "react-intl";
import { FeilIDager, InnsendingState } from "../../../../../types/innsending";
import { UtfyltDag } from "../utfyllingConfig";
import { RootState } from "../../../../../store/configureStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { hentIntl } from "../../../../../utils/intlUtil";
import { Undertittel } from "nav-frontend-typografi";
import { InnsendingActions } from "../../../../../actions/innsending";
import UtvidetInformasjon from "../../../../../components/utvidetinformasjon/utvidetInformasjon";

interface MapStateToProps {
  innsending: InnsendingState;
}

interface MapDispatchToProps {
  oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

interface UkeProps {
  ukeNummer: number;
  aap: boolean;
  tekstId: string;
  forklaringId: string;
  bareArbeid: boolean;
}

type ArbeidsradProps = UkeProps &
  FeilIDager &
  MapStateToProps &
  MapDispatchToProps;

class Arbeidsrad extends React.Component<ArbeidsradProps> {
  componentDidMount(): void {
    let rensetUtfylteDager = this.props.innsending.utfylteDager.map(
      utfyltDag => {
        if (utfyltDag.arbeidetTimer === "0") {
          return {
            ...utfyltDag,
            arbeidetTimer: undefined
          };
        }
        return { ...utfyltDag };
      }
    );
    this.props.oppdaterDager(rensetUtfylteDager);
  }

  setTimer = (event: React.ChangeEvent<HTMLInputElement>, ukedag: string) => {
    const match = event.target.value.match(/^[0-9]?\d{0,2}?([,.]?[0-9]?)?$/);
    if (match !== null) {
      let nyVerdi = event.target.value;
      if (match[0] === "," || match[0] === ".") {
        nyVerdi = "0.";
      } else if (nyVerdi.includes(",")) {
        nyVerdi = nyVerdi.replace(",", ".");
      }
      const oppdaterteDager = this.props.innsending.utfylteDager.map(dag => {
        if (
          dag.uke === this.props.ukeNummer &&
          matchUkedager(dag.dag, ukedag.trim())
        ) {
          return {
            ...dag,
            arbeidetTimer: event.target.value === "" ? undefined : nyVerdi
          };
        }
        return { ...dag };
      });
      this.props.oppdaterDager(oppdaterteDager);
    }
  };

  finnIndex = (ukedag: string): number => {
    let dagObj = null;
    this.props.innsending.utfylteDager.map(dag => {
      if (
        matchUkedager(dag.dag, ukedag.trim()) &&
        dag.uke === this.props.ukeNummer
      ) {
        dagObj = dag;
      }
    });
    if (dagObj !== null) {
      return this.props.innsending.utfylteDager.indexOf(dagObj, 0);
    }
    return -1;
  };

  settFelter = () => {
    return hentUkedagerSomStringListe().map(dag => {
      let ukedag = konverterUkedag(dag);
      let { utfylteDager } = this.props.innsending;
      let utfyltDagIndex = this.finnIndex(ukedag);

      return (
        <Input
          className="arbeidInput"
          key={ukedag}
          label={
            <span className="vekk">
              {dag} {hentIntl().formatMessage({ id: this.props.tekstId })}
            </span>
          }
          bredde="XS"
          step={0.5}
          type={"text"}
          value={
            typeof utfylteDager[utfyltDagIndex].arbeidetTimer !== "undefined"
              ? utfylteDager[utfyltDagIndex].arbeidetTimer
              : ""
          }
          onChange={event => {
            this.setTimer(event, ukedag);
          }}
          feil={
            typeof this.props.feilIDager !== "undefined"
              ? this.props.feilIDager.indexOf(
                  ukedag.trim() + this.props.ukeNummer
                ) >= 0
                ? { feilmelding: "" }
                : undefined
              : undefined
          }
        />
      );
    });
  };

  innhold = () => {
    let { tekstId, aap, forklaringId, feil, bareArbeid } = this.props;
    return (
      <div
        className="arbeidsrad"
        style={{
          backgroundColor: feil ? "#e79999" : "",
          borderBottom: bareArbeid ? "solid 1px #c6c2bf" : "none"
        }}
      >
        <div className="kategori_forklaring">
          <Undertittel>
            <FormattedHTMLMessage id={tekstId} />
          </Undertittel>
          <UtvidetInformasjon>
            <FormattedHTMLMessage
              id={aap ? forklaringId + "-AAP" : forklaringId}
            />
          </UtvidetInformasjon>
        </div>
        <div className="inputrad_arbeid">{this.settFelter()}</div>
      </div>
    );
  };

  render() {
    return <div>{this.innhold()}</div>;
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager))
  };
};

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(Arbeidsrad);
