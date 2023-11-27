import * as React from "react";
import { Innholdstittel } from "nav-frontend-typografi";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { Alert } from "@navikt/ds-react";

class Feilside extends React.Component<object, object> {
  public render() {
    return (
      <main className="sideinnhold">
        <Innholdstittel className="seksjon flex-innhold sentrert">
          {formatHtmlMessage("ikke.tilgang.overskrift")}
        </Innholdstittel>
        <section className="seksjon flex-innhold sentrert">
          <Alert variant="error">
            {formatHtmlMessage("ikke.tilgang.tekst")}
          </Alert>
        </section>
      </main>
    );
  }
}

export default Feilside;
