import * as React from "react";
import { formatHtmlMessage, formatMessage } from "../../utils/intlUtil";
import Sprakvelger from "../../components/sprakvelger/sprakvelger";
import Tabell from "../../components/tabell/desktop/tabell";
import NavKnapp, { KnappTyper } from "../../components/knapp/navKnapp";
import { Innsendingstyper } from "../../types/innsending";
import { Meldekort, MeldekortKolonne, MeldekortRad } from "../../types/meldekort";
import { Heading } from "@navikt/ds-react";

interface Props {
  nesteAktivtMeldekort: Meldekort;
  rows: MeldekortRad[];
  columns: MeldekortKolonne[];
}

function EtterregistreringInnhold({
  rows,
  columns,
  nesteAktivtMeldekort
}: Props) {
  return (
    <main className="sideinnhold">
      <section className="seksjon flex-innhold tittel-sprakvelger">
        <Heading size="large">
          {formatMessage("overskrift.etterregistrering.innsending")}
        </Heading>
        <Sprakvelger />
      </section>
      <section className="seksjon">
        <div className="item">
          {formatHtmlMessage("sendMeldekort.info.kanSende")}
        </div>
        <div className="item">
          <Tabell rows={rows} columns={columns} />
        </div>
      </section>

      <section className="seksjon flex-innhold sentrert">
        <NavKnapp
          type={KnappTyper.HOVED}
          nestePath={"innsending"}
          tekstid={"naviger.neste"}
          nesteAktivtMeldekort={nesteAktivtMeldekort}
          nesteInnsendingstype={Innsendingstyper.ETTERREGISTRERING}
        />
      </section>
    </main>
  );
}

export default EtterregistreringInnhold;
