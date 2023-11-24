import * as React from "react";
import { Undertittel } from "nav-frontend-typografi";
import { formatHtmlMessage } from "../../utils/intlUtil";

export const baksystemFeilmeldingContent = () => {
  return (
    <div>
      <Undertittel children={formatHtmlMessage("feilmelding.baksystem.overskrift")} />
      {formatHtmlMessage("feilmelding.baksystem")}
    </div>
  );
};
