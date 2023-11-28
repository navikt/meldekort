import * as React from "react";
import { hentUkedager, hentUkedagerSomStringListe, konverterUkedag } from "../../../../../utils/ukedager";
import { FeilIDager, InnsendingState } from "../../../../../types/innsending";
import { UtfyltDag } from "../utfyltDagConfig";
import { RootState } from "../../../../../store/configureStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { formatHtmlMessage } from "../../../../../utils/intlUtil";
import { Undertittel } from "nav-frontend-typografi";
import { InnsendingActions } from "../../../../../actions/innsending";
import UtvidetInformasjon from "../../../../../components/utvidetinformasjon/utvidetInformasjon";
import { Checkbox } from "@navikt/ds-react";

interface MapStateToProps {
  innsending: InnsendingState;
}

interface MapDispatchToProps {
  oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

interface RadProps {
  tekstId: string;
  ukeNummer: number;
  typeYtelsePostfix: string;
  forklaringId: string;
}

type AktivitetsradProps = RadProps &
  FeilIDager &
  MapStateToProps &
  MapDispatchToProps;

class Aktivitetsrad extends React.Component<AktivitetsradProps, object> {
  setVerdi = (ukedag: number) => {
    const oppdaterteDager = this.props.innsending.utfylteDager.map(dag => {
      if (dag.uke === this.props.ukeNummer && dag.dag === ukedag) {
        switch (this.props.tekstId) {
          case "utfylling.tiltak":
            return {
              ...dag,
              kurs: !dag.kurs,
            };
          case "utfylling.syk":
            return {
              ...dag,
              syk: !dag.syk,
            };
          case "utfylling.ferieFravar":
            return {
              ...dag,
              annetFravaer: !dag.annetFravaer,
            };
          default:
            return {
              ...dag,
            };
        }
      }
      return { ...dag };
    });
    this.props.oppdaterDager(oppdaterteDager);
  };

  isChecked = (ukedag: number): boolean => {
    const valgtDag = this.props.innsending.utfylteDager.filter(
      dag => dag.uke === this.props.ukeNummer && dag.dag === ukedag
    );
    let checked: boolean = false;
    switch (this.props.tekstId) {
      case "utfylling.tiltak":
        checked = valgtDag[0].kurs;
        break;
      case "utfylling.syk":
        checked = valgtDag[0].syk;
        break;
      case "utfylling.ferieFravar":
        checked = valgtDag[0].annetFravaer;
        break;
      default:
        break;
    }
    return checked;
  };

  settFelter = () => {
    return hentUkedagerSomStringListe().map((dag, index) => {
      let erFeil: boolean = false;
      const ukedag = konverterUkedag(index);

      if (typeof this.props.feilIDager !== "undefined") {
        this.props.feilIDager.forEach(e =>
          e.uke === this.props.ukeNummer && e.dag === ukedag
            ? (erFeil = true)
            : null
        );
      }

      return (
        <Checkbox
          className={
            erFeil ? "aktivitet__checkbox_feil" : "aktivitet__checkbox"
          }
          key={ukedag}
          checked={this.isChecked(ukedag)}
          onChange={() => {
            this.setVerdi(ukedag);
          }}
          error={typeof this.props.feilIDager !== "undefined" ? erFeil : false}
        >
          <span className="vekk">
            {dag} {formatHtmlMessage(this.props.tekstId)}
          </span>
        </Checkbox>
      );
    });
  };

  hentFarge = () => {
    switch (this.props.tekstId) {
      case "utfylling.tiltak":
        return {
          borderLeftColor: "#ffe9cc",
          backgroundColor: this.props.feil ? "#e79999" : "",
        };
      case "utfylling.syk":
        return {
          borderLeftColor: "#6ab889",
          backgroundColor: this.props.feil ? "#e79999" : "",
        };
      case "utfylling.ferieFravar":
        return {
          borderLeftColor: "#c1b5d0",
          backgroundColor: this.props.feil ? "#e79999" : "",
        };
      default:
        break;
    }
  };

  innhold = () => {
    const { tekstId, typeYtelsePostfix, forklaringId } = this.props;
    return (
      <div className="aktivitetsrad" style={this.hentFarge()}>
        <Undertittel tag="h4" className={"aktivitetsrad__tittel"}>
          {formatHtmlMessage(tekstId)}
        </Undertittel>
        <UtvidetInformasjon>
          {formatHtmlMessage(forklaringId + typeYtelsePostfix)}
        </UtvidetInformasjon>
        <div className="ukedager--mobil">{hentUkedager()}</div>
        <div className="aktivitetsrad__inputfelter">{this.settFelter()}</div>
      </div>
    );
  };

  render() {
    return <>{this.innhold()}</>;
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Aktivitetsrad);
