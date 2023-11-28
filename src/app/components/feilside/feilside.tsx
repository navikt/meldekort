import * as React from "react";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { Alert, Heading } from "@navikt/ds-react";

class Feilside extends React.Component<object, object> {
  public render() {
    return (
      <main className="sideinnhold">
        <Heading size="large" className="seksjon flex-innhold sentrert">
          {formatHtmlMessage("ikke.tilgang.overskrift")}
        </Heading>
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
