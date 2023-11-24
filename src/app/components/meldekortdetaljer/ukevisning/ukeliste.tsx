import * as React from "react";
import { hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from "../../../utils/dates";
import { hentDagliste } from "./dagliste";
import { Meldekort, MeldekortDag } from "../../../types/meldekort";
import Undertittel from "nav-frontend-typografi/lib/undertittel";

interface Props {
  aktivtMeldekort: Meldekort;
  typeYtelsePostfix: string;
  meldekortDager: MeldekortDag[];
  ukeNr: number;
}

const Ukeliste: React.FunctionComponent<Props> = ({
  ukeNr,
  typeYtelsePostfix,
  meldekortDager,
  aktivtMeldekort
}) => {
  const dagListe = hentDagliste(meldekortDager, typeYtelsePostfix);

  if (dagListe.length > 0) {
    return (
      <div className="uke">
        <Undertittel className="uketittel">
          {ukeNr === 1
            ? hentNummerOgDatoForForsteUke(aktivtMeldekort.meldeperiode.fra)
            : hentNummerOgDatoForAndreUke(aktivtMeldekort.meldeperiode.til)}
        </Undertittel>
        <hr className="detaljerborder noPrint" />
        <>{dagListe}</>
      </div>
    );
  }
  return null;
};

export default Ukeliste;
