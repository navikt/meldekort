import * as React from 'react';
import { Meldekort, MeldekortRad } from '../../types/meldekort';
import { Person } from '../../types/person';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { formaterDato, formaterUkeOgDatoPeriode } from '../../utils/dates';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';
import { harKortStatusOPPRellerSENDT } from '../../utils/meldekortUtils';

interface Props {
  rows: MeldekortRad[];
  person: Person;
  innsendingsklareMeldekort: Meldekort[];
}

function MeldingOmMeldekortSomIkkeErKlare({
  rows,
  person,
  innsendingsklareMeldekort,
}: Props) {
  let meldekortliste = innsendingsklareMeldekort;

  const hentIdTilNesteInnsendingsklareMeldekort = (
    meldekortListe: Meldekort[]
  ): number => {
    let meldekortId = 0;
    if (meldekortListe === undefined) {
      return meldekortId;
    }
    meldekortListe.map(meldekort => {
      if (harKortStatusOPPRellerSENDT(meldekort)) {
        if (!meldekort.meldeperiode.kanKortSendes) {
          meldekortId = meldekort.meldekortId;
        }
      }
    });
    return meldekortId;
  };

  const meldekortSomIkkeKanSendesInnEnda = (
    meldekort: Meldekort[]
  ): Meldekort[] => {
    if (meldekortliste.length === 0) {
      return meldekort.filter(mk => {
        return (
          !mk.meldeperiode.kanKortSendes && harKortStatusOPPRellerSENDT(mk)
        );
      });
    }
    return [];
  };

  const returnerVarselIngenMeldekortASende = (
    <FormattedMessage id="sporsmal.ingenMeldekortASende" />
  );

  const visMeldingOmMeldekort = () => {
    if (rows.length === 0 && meldekortliste !== undefined) {
      const meldekortId = hentIdTilNesteInnsendingsklareMeldekort(
        meldekortliste
      );
      const meldekort = meldekortliste.filter(
        m => m.meldekortId === meldekortId
      );
      const meldekortSomIkkeKanSendesEnda = meldekortSomIkkeKanSendesInnEnda(
        person.meldekort
      );
      if (
        meldekort.length === 0 &&
        meldekortSomIkkeKanSendesEnda.length !== 0
      ) {
        return (
          <>
            <Normaltekst>
              <FormattedMessage id="overskrift.nesteMeldekort" />
              <FormattedMessage id="sendMeldekort.info.innsendingStatus.kanSendes" />
              {formaterDato(
                meldekortSomIkkeKanSendesEnda[0].meldeperiode.kortKanSendesFra
              )}
            </Normaltekst>
            <Element>
              {formaterUkeOgDatoPeriode(
                meldekortSomIkkeKanSendesEnda[0].meldeperiode.fra,
                meldekortSomIkkeKanSendesEnda[0].meldeperiode.til
              )}
            </Element>
            <FormattedMessage id="sendMeldekort.info.ingenKlare" />
          </>
        );
      } else {
        return returnerVarselIngenMeldekortASende;
      }
    } else {
      return returnerVarselIngenMeldekortASende;
    }
  };

  return (
    <Veilederpanel svg={<img alt="veileder ikon" src={veileder} />}>
      <div className="send-meldekort-varsel">{visMeldingOmMeldekort()}</div>
    </Veilederpanel>
  );
}

export default MeldingOmMeldekortSomIkkeErKlare;
