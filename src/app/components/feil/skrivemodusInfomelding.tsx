import React from "react";
import { Skrivemodus } from "../../types/skrivemodus";
import { RootState } from "../../store/configureStore";
import { connect } from "react-redux";
import { formatHtmlMessage, hentLocale } from "../../utils/intlUtil";
import { Alert } from "@navikt/ds-react";

interface MapStateToProps {
  skrivemodus: Skrivemodus;
}

const SkrivemodusInfomelding: React.FunctionComponent<MapStateToProps> = props => {
  const skrivemodus = props.skrivemodus;

  const hentSkrivemodusInfomelding = () => {
    if (skrivemodus.melding === null) {
      return formatHtmlMessage("skrivemodusInfomelding")
    } else {
      return hentLocale() === "nb"
        ? skrivemodus.melding.norsk
        : skrivemodus.melding.engelsk;
    }
  };

  return (
    <Alert variant="info">{hentSkrivemodusInfomelding()}</Alert>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    skrivemodus: state.skrivemodus,
  };
};

export default connect<object, object, MapStateToProps>(mapStateToProps, null)(SkrivemodusInfomelding);
