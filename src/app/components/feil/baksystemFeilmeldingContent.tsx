import * as React from "react";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { Heading } from "@navikt/ds-react";

export const baksystemFeilmeldingContent = () => {
  return (
    <div>
      <Heading size="small">
        {formatHtmlMessage("feilmelding.baksystem.overskrift")}
      </Heading>
      {formatHtmlMessage("feilmelding.baksystem")}
    </div>
  );
};
