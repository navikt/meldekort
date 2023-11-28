import * as React from "react";
import UtvidetInformasjon from "../../utvidetinformasjon/utvidetInformasjon";
import checkMark from "../../../ikoner/check.svg";
import { formatHtmlMessage } from "../../../utils/intlUtil";
import { Heading } from "@navikt/ds-react";

interface Props {
  begrunnelse: string;
}

const BegrunnelseVisning: React.FunctionComponent<Props> = props => {
  if (typeof props.begrunnelse !== "undefined") {
    const begrunnelse = String(props.begrunnelse);
    if (begrunnelse.length > 0) {
      return (
        <section className="begrunnelse">
          <div className="sporsmalstekst">
            <Heading size="small">
              {formatHtmlMessage("korrigering.sporsmal.begrunnelse")}
            </Heading>
            <UtvidetInformasjon>
              {formatHtmlMessage("forklaring.sporsmal.begrunnelse")}
            </UtvidetInformasjon>
          </div>
          <img className={"checkmark"} alt="" src={checkMark} />
          <span>{props.begrunnelse}</span>
        </section>
      );
    }
  }
  return null;
};

export default BegrunnelseVisning;
