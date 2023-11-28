import * as React from "react";
import checkMark from "../../../ikoner/check.svg";
import UtvidetInformasjon from "../../utvidetinformasjon/utvidetInformasjon";
import { formatHtmlMessage } from "../../../utils/intlUtil";
import { Heading } from "@navikt/ds-react";

interface Props {
  sporsmalOgSvar: {
    kategori: string;
    sporsmal: string;
    forklaring: string;
    svar: boolean;
    formatertDato?: string;
  }[];
}

const SporsmalOgSvarVisning: React.FunctionComponent<Props> = ({
  sporsmalOgSvar
}) => {
  const hentTekstForSvar = (svar: boolean) => {
    if (svar) {
      return formatHtmlMessage("diverse.ja")
    }
    return formatHtmlMessage("diverse.nei")
  };

  return (
    <>
      {sporsmalOgSvar.map(spm => {
        return (
          <section key={spm.sporsmal} className="sporsmalsgruppe">
            <div className="sporsmalstekst">
              <Heading size="small" level="3">
                {formatHtmlMessage(spm.sporsmal)}
                {spm.formatertDato ? <span>{spm.formatertDato}?</span> : null}
              </Heading>
              <UtvidetInformasjon>
                {formatHtmlMessage(spm.forklaring)}
              </UtvidetInformasjon>
            </div>
            <img alt="" src={checkMark} />
            <span> {hentTekstForSvar(spm.svar)} </span>
          </section>
        );
      })}
    </>
  );
};

export default SporsmalOgSvarVisning;
