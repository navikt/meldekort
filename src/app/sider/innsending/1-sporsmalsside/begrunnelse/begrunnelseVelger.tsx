import * as React from "react";
import { connect } from "react-redux";
import { InnsendingActions } from "../../../../actions/innsending";
import { Dispatch } from "redux";
import { formatHtmlMessage, formatMessage, hentIntl } from "../../../../utils/intlUtil";
import { Begrunnelse } from "../../../../types/innsending";
import { RootState } from "../../../../store/configureStore";
import UtvidetInformasjon from "../../../../components/utvidetinformasjon/utvidetInformasjon";
import { Heading, Select } from "@navikt/ds-react";

interface MapStateToProps {
  begrunnelse: Begrunnelse;
  typeYtelsePostfix: string;
}

interface MapDispatchToProps {
  settBegrunnelse: (begrunnelse: Begrunnelse) => void;
}

interface BegrunnselseProps {
  erFeil: boolean;
}

type Props = MapDispatchToProps & MapStateToProps & BegrunnselseProps;

const BegrunnelseVelger: React.FunctionComponent<Props> = props => {
  const optionsString = hentIntl().messages["korriger.begrunnelse.valg"] as string;
  const options = JSON.parse(optionsString ? optionsString : "{}");

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.settBegrunnelse({
      valgtArsak: event.target.value,
      valgtArsakTekst: options[event.target.value],
      erFeil: event.target.value === "",
    });
  };

  const begrunnelseClass = props.erFeil ? "feilmelding" : "";

  const { valgtArsak } = props.begrunnelse;

  return (
    <div className={"seksjon begrunnelse " + begrunnelseClass}>
      <Select
        label={
          <>
            <Heading size="small">
              {formatHtmlMessage("korrigering.sporsmal.begrunnelse")}
            </Heading>
            <UtvidetInformasjon>
              {formatHtmlMessage("forklaring.sporsmal.begrunnelse" + props.typeYtelsePostfix)}
            </UtvidetInformasjon>
          </>
        }
        onChange={handleOnChange}
        value={valgtArsak}
      >
        <option value={""}>
          {formatMessage("begrunnelse.velgArsak")}
        </option>
        {Object.keys(options).map(key => (
          <option value={key} key={options[key]}>
            {options[key]}
          </option>
        ))}
      </Select>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    begrunnelse: state.innsending.begrunnelse,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settBegrunnelse: (begrunnelse: Begrunnelse) =>
      dispatch(InnsendingActions.settBegrunnelse(begrunnelse)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BegrunnelseVelger);
