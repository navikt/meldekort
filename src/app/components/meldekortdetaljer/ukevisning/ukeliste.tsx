import * as React from "react";
import { hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from "../../../utils/dates";
import { hentDagliste } from "./dagliste";
import { Meldekort, MeldekortDag } from "../../../types/meldekort";
import { Heading } from "@navikt/ds-react";

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
        <Heading size="small" className="uketittel">
          {ukeNr === 1
            ? hentNummerOgDatoForForsteUke(aktivtMeldekort.meldeperiode.fra)
            : hentNummerOgDatoForAndreUke(aktivtMeldekort.meldeperiode.til)}
        </Heading>
        <hr className="detaljerborder noPrint" />
        <>{dagListe}</>
      </div>
    );
  }
  return null;
};

export default Ukeliste;
