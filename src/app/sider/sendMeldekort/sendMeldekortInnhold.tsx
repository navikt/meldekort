import * as React from 'react';
import { Meldekort, MeldekortKolonne, MeldekortRad } from '../../types/meldekort';
import Tabell from '../../components/tabell/desktop/tabell';
import { Normaltekst } from 'nav-frontend-typografi';
import NavKnapp, { KnappTyper } from '../../components/knapp/navKnapp';
import { Innsendingstyper } from '../../types/innsending';
import { Router } from '../../types/router';
import { BaksystemFeilmelding } from '../../types/ui';
import { formatMessage } from "../../utils/intlUtil";

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
        {formatMessage("sendMeldekort.info.kanSende")}
      </div>
      <section className="seksjon">
        <div className="item">
          <Tabell rows={rows} columns={columns} />
        </div>
      </section>
      <section className="seksjon">
        <div className="box">
          <Normaltekst>
            {formatMessage("sendMeldekort.info.neste")}
          </Normaltekst>
          <Normaltekst>
            {formatMessage("sendMeldekort.info.eldstePerioden")}
          </Normaltekst>
          <Normaltekst>
            {formatMessage("sendMeldekort.info.automatiskLedet")}
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
