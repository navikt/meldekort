import * as React from "react";
import { Meldekort, MeldekortKolonne, MeldekortRad } from "../../types/meldekort";
import Tabell from "../../components/tabell/desktop/tabell";
import { Normaltekst } from "nav-frontend-typografi";
import NavKnapp, { KnappTyper } from "../../components/knapp/navKnapp";
import { Innsendingstyper } from "../../types/innsending";
import { BaksystemFeilmelding } from "../../types/ui";
import { formatHtmlMessage } from "../../utils/intlUtil";

interface Props {
  rows: MeldekortRad[];
  columns: MeldekortKolonne[];
  innsendingsklareMeldekort: Meldekort[];
  baksystemFeilmelding: BaksystemFeilmelding;
}
function InnsendingsTabell({
  rows,
  columns,
  innsendingsklareMeldekort
}: Props) {
  return (
    <>
      <div className="item">
        {formatHtmlMessage("sendMeldekort.info.kanSende")}
      </div>
      <section className="seksjon">
        <div className="item">
          <Tabell rows={rows} columns={columns} />
        </div>
      </section>
      <section className="seksjon">
        <div className="box">
          <Normaltekst>
            {formatHtmlMessage("sendMeldekort.info.neste")}
          </Normaltekst>
          <Normaltekst>
            {formatHtmlMessage("sendMeldekort.info.eldstePerioden")}
          </Normaltekst>
          <Normaltekst>
            {formatHtmlMessage("sendMeldekort.info.automatiskLedet")}
          </Normaltekst>
        </div>
      </section>
      <section className="seksjon flex-innhold sentrert">
        <NavKnapp
          type={KnappTyper.HOVED}
          nestePath={"innsending"}
          tekstid={"naviger.neste"}
          nesteAktivtMeldekort={innsendingsklareMeldekort[0]}
          nesteInnsendingstype={Innsendingstyper.INNSENDING}
        />
      </section>
    </>
  );
}

export default InnsendingsTabell;
