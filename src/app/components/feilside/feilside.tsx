import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage } from 'react-intl';

class Feilside extends React.Component<{}, {}> {
  public render() {
    return (
      <main className="sideinnhold">
        <Innholdstittel className="seksjon flex-innhold sentrert">
          <FormattedHTMLMessage id="ikke.tilgang.overskrift" />
        </Innholdstittel>
        <section className="seksjon flex-innhold sentrert">
          <AlertStripe type="feil">
            <FormattedHTMLMessage id="ikke.tilgang.tekst" />
          </AlertStripe>
        </section>
      </main>
    );
  }
}

export default Feilside;
