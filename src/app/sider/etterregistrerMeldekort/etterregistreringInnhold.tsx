import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { hentIntl } from '../../utils/intlUtil';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage } from 'react-intl';
import Tabell from '../../components/tabell/desktop/tabell';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import { Innsendingstyper } from '../../types/innsending';
import { Meldekort, MeldekortRad } from '../../types/meldekort';
import { Router } from '../../types/router';

interface Props {
  router: Router;
  nesteAktivtMeldekort: Meldekort;
  rows: MeldekortRad[];
  columns: any;
}

function EtterregistreringInnhold({
  rows,
  columns,
  nesteAktivtMeldekort,
  router,
}: Props) {
  return (
    <main className="sideinnhold">
      <section className="seksjon flex-innhold tittel-sprakvelger">
        <Innholdstittel className="seksjon">
          {hentIntl().formatMessage({
            id: 'overskrift.etterregistrering.innsending',
          })}
        </Innholdstittel>
        <Sprakvelger />
      </section>
      <section className="seksjon">
        <div className="item">
          <FormattedHTMLMessage id="sendMeldekort.info.kanSende" />
        </div>
        <div className="item">
          <Tabell rows={rows} columns={columns} />
        </div>
      </section>

      <section className="seksjon flex-innhold sentrert">
        <NavKnapp
          type={knappTyper.hoved}
          nestePath={router.location.pathname + '/innsending'}
          tekstid={'naviger.neste'}
          nesteAktivtMeldekort={nesteAktivtMeldekort}
          nesteInnsendingstype={Innsendingstyper.etterregistrering}
        />
      </section>
    </main>
  );
}

export default EtterregistreringInnhold;
