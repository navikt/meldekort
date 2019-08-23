import * as React from 'react';
import { KortStatus, Meldekort, MeldekortRad } from '../../types/meldekort';
import { Person } from '../../types/person';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { formaterDato, formaterUkeOgDatoPeriode } from '../../utils/dates';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';

interface Props {
  rows: MeldekortRad[];
  person: Person;
  filtrerMeldekortListe: (meldekort: Meldekort[]) => Meldekort[];
}

const MeldingOmMeldekortSomIkkeErKlare: React.FC<Props> = ({
  rows,
  person,
  filtrerMeldekortListe,
}) => {
  let meldekortliste = filtrerMeldekortListe(person.meldekort);

  const kortStatuserOPPRellerSENDT = (meldekort: Meldekort) =>
    meldekort.kortStatus === KortStatus.OPPRE ||
    meldekort.kortStatus === KortStatus.SENDT;

  const forTidligASende = (meldekortListe: Meldekort[]): number => {
    let meldekortId = 0;
    if (meldekortListe === undefined) {
      return meldekortId;
    }
    meldekortListe.map(meldekort => {
      if (kortStatuserOPPRellerSENDT(meldekort)) {
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
    if (filtrerMeldekortListe(meldekort).length === 0) {
      return meldekort.filter(mk => {
        return !mk.meldeperiode.kanKortSendes && kortStatuserOPPRellerSENDT(mk);
      });
    }
    return [];
  };
  if (rows.length === 0 && meldekortliste !== undefined) {
    let meldekortId = forTidligASende(meldekortliste);
    let meldekort = meldekortliste.filter(m => m.meldekortId === meldekortId);
    let meldekortSomIkkeKanSendesEnda = meldekortSomIkkeKanSendesInnEnda(
      person.meldekort
    );
    if (meldekort.length === 0 && meldekortSomIkkeKanSendesEnda.length !== 0) {
      return (
        <Veilederpanel svg={<img alt="" src={veileder} />}>
          <div className="send-meldekort-varsel">
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
          </div>
        </Veilederpanel>
      );
    } else {
      return (
        <Veilederpanel svg={<img alt="" src={veileder} />}>
          <div className="send-meldekort-varsel">
            <FormattedMessage id="sporsmal.ingenMeldekortASende" />
          </div>
        </Veilederpanel>
      );
    }
  } else {
    return (
      <Veilederpanel svg={<img alt="" src={veileder} />}>
        <div className="send-meldekort-varsel">
          <FormattedMessage id="sporsmal.ingenMeldekortASende" />
        </div>
      </Veilederpanel>
    );
  }
};

export default MeldingOmMeldekortSomIkkeErKlare;
