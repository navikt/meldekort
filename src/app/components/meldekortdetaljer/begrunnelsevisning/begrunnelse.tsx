import * as React from "react";
import UtvidetInformasjon from "../../utvidetinformasjon/utvidetInformasjon";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import checkMark from "../../../ikoner/check.svg";
import { formatHtmlMessage } from "../../../utils/intlUtil";

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
            <Undertittel>
              {formatHtmlMessage("korrigering.sporsmal.begrunnelse")}
            </Undertittel>
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
