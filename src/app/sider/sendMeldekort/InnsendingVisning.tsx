import * as React from 'react';
import { Meldekort, MeldekortRad } from '../../types/meldekort';
import { FormattedHTMLMessage } from 'react-intl';
import Tabell from '../../components/tabell/desktop/tabell';
import { Normaltekst } from 'nav-frontend-typografi';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import { Innsendingstyper } from '../../types/innsending';
import { Router } from '../../types/router';

interface Props {
  rows: MeldekortRad[];
  columns: [
    { key: 'periode'; label: 'Periode' },
    { key: 'dato'; label: 'Dato' }
  ];
  router: Router;
  innsendingsklareMeldekort: Meldekort[];
}
const InnsendingsTabell: React.FC<Props> = ({
  rows,
  columns,
  router,
  innsendingsklareMeldekort,
}) => {
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
          type={knappTyper.hoved}
          nestePath={router.location.pathname + '/innsending'}
          tekstid={'naviger.neste'}
          nesteAktivtMeldekort={innsendingsklareMeldekort[0]}
          nesteInnsendingstype={Innsendingstyper.innsending}
        />
      </section>
    </>
  );
};

export default InnsendingsTabell;
