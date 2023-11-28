import * as React from "react";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { Alert, BodyShort } from "@navikt/ds-react";

export const ikkeFortsetteRegistrertContent = () => {
  return (
    <div className="modal-overskrift">
      <Alert variant="warning">
        <div className="modal-tekst">
          <BodyShort>
            {formatHtmlMessage("sporsmal.bekreftelse")}
          </BodyShort>
        </div>
      </Alert>
    </div>
  );
};
