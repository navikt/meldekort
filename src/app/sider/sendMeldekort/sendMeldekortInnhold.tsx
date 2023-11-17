import * as React from 'react';
import { Meldekort, MeldekortKolonne, MeldekortRad } from '../../types/meldekort';
import { FormattedHTMLMessage } from 'react-intl';
import Tabell from '../../components/tabell/desktop/tabell';
import { Normaltekst } from 'nav-frontend-typografi';
import NavKnapp, { KnappTyper } from '../../components/knapp/navKnapp';
import { Innsendingstyper } from '../../types/innsending';
import { Router } from '../../types/router';
import { BaksystemFeilmelding } from '../../types/ui';

interface Props {
  rows: MeldekortRad[];
  columns: MeldekortKolonne[];
  router: Router;
  innsendingsklareMeldekort: Meldekort[];
  baksystemFeilmelding: BaksystemFeilmelding;
}
function InnsendingsTabell({
  rows,
  columns,
  router,
  innsendingsklareMeldekort,
}: Props) {
  return (
    <>
      <div className="item">
        <FormattedHTMLMessage id="sendMeldekort.info.kanSende" />
      </div>
      <section className="seksjon">
        <div className="item">
          <Tabell rows={rows} columns={columns} />
        </div>
      </section>
      <section className="seksjon">
        <div className="box">
          <Normaltekst>
            <FormattedHTMLMessage id="sendMeldekort.info.neste" />
          </Normaltekst>
          <Normaltekst>
            <FormattedHTMLMessage id="sendMeldekort.info.eldstePerioden" />
          </Normaltekst>
          <Normaltekst>
            <FormattedHTMLMessage id="sendMeldekort.info.automatiskLedet" />
          </Normaltekst>
        </div>
      </section>
      <section className="seksjon flex-innhold sentrert">
        <NavKnapp
          type={KnappTyper.HOVED}
          nestePath={router.location.pathname + '/innsending'}
          tekstid={'naviger.neste'}
          nesteAktivtMeldekort={innsendingsklareMeldekort[0]}
          nesteInnsendingstype={Innsendingstyper.INNSENDING}
        />
      </section>
    </>
  );
}

export default InnsendingsTabell;
