import * as React from 'react';
import { hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from '../../../utils/dates';
import { hentDagliste } from './dagliste';
import { Meldekort, MeldekortDag } from '../../../types/meldekort';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';

interface Props {
  aktivtMeldekort: Meldekort;
  erAap: boolean;
  meldekortDager: MeldekortDag[];
  ukeNr: number;
}

const Ukeliste: React.FunctionComponent<Props> = ({ ukeNr, erAap, meldekortDager, aktivtMeldekort }) => {
  let uke: string = '';
  if (ukeNr === 1) {
    uke = hentNummerOgDatoForForsteUke(aktivtMeldekort.meldeperiode.fra);
  } else if (ukeNr === 2) {
    uke = hentNummerOgDatoForAndreUke(aktivtMeldekort.meldeperiode.til);
  }

  const dagListe = hentDagliste(meldekortDager, erAap);

  if (dagListe.length > 0) {
    return (
      <div className="uke">
        <Undertittel className="uketittel flex-innhold sentrert">{uke}</Undertittel>
        <hr className="detaljerborder noPrint" />
        <>{dagListe}</>
      </div>
    );
  }
  return null;
};

export default Ukeliste;
