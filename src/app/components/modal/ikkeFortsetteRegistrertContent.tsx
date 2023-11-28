import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import * as React from "react";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { Alert } from "@navikt/ds-react";

export const ikkeFortsetteRegistrertContent = () => {
  return (
    <div className="modal-overskrift">
      <Undertittel>{formatHtmlMessage("sporsmal.bekreft")}</Undertittel>
      <Alert variant="warning">
        <div className="modal-tekst">
          <Normaltekst>
            {formatHtmlMessage("sporsmal.bekreftelse")}
          </Normaltekst>
        </div>
      </Alert>
    </div>
  );
};
