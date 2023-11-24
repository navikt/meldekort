import * as React from "react";
import { Innholdstittel } from "nav-frontend-typografi";
import AlertStripe from "nav-frontend-alertstriper";
import { formatHtmlMessage } from "../../utils/intlUtil";

class Feilside extends React.Component<object, object> {
  public render() {
    return (
      <main className="sideinnhold">
        <Innholdstittel className="seksjon flex-innhold sentrert">
          {formatHtmlMessage("ikke.tilgang.overskrift")}
        </Innholdstittel>
        <section className="seksjon flex-innhold sentrert">
          <AlertStripe type="feil">
            {formatHtmlMessage("ikke.tilgang.tekst")}
          </AlertStripe>
        </section>
      </main>
    );
  }
}

export default Feilside;
