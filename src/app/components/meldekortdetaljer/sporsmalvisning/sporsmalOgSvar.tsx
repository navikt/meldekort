import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import checkMark from '../../../ikoner/check.svg';
import UtvidetInformasjon from '../../utvidetinformasjon/utvidetInformasjon';
import { formatMessage } from "../../../utils/intlUtil";

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
  sporsmalOgSvar,
}) => {
  const hentTekstForSvar = (svar: boolean) => {
    if (svar) {
      return formatMessage("diverse.ja")
    }
    return formatMessage("diverse.nei")
  };

  return (
    <>
      {sporsmalOgSvar.map(spm => {
        return (
          <section key={spm.sporsmal} className="sporsmalsgruppe">
            <div className="sporsmalstekst">
              <Undertittel tag="h3">
                {formatMessage(spm.sporsmal)}
                {spm.formatertDato ? <span>{spm.formatertDato}?</span> : null}
              </Undertittel>
              <UtvidetInformasjon>
                {formatMessage(spm.forklaring)}
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
