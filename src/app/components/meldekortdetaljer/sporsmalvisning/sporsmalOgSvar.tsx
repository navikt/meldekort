import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import checkMark from '../../../ikoner/check.svg';
import UtvidetInformasjon from '../../utvidetinformasjon/utvidetInformasjon';

interface Props {
  sporsmalOgSvar: {
    kategori: string;
    sporsmal: string;
    forklaring: string;
    svar: boolean;
    formatertDato?: string;
  }[];
}

const SporsmalOgSvarVisning: React.FunctionComponent<Props> = ({ sporsmalOgSvar }) => {
  const hentTekstForSvar = (svar: boolean) => {
    if (svar) {
      return <FormattedMessage id="diverse.ja" />;
    }
    return <FormattedMessage id="diverse.nei" />;
  };

  return (
    <>
      {sporsmalOgSvar.map(spm => {
        return (
          <section key={spm.sporsmal} className="sporsmalsgruppe">
            <div className="flex-sporsmal-hjelpetekst-container">
              <Undertittel>
                <FormattedMessage id={spm.sporsmal} />
                {spm.formatertDato ? <span>{spm.formatertDato}?</span> : null}
              </Undertittel>
              <UtvidetInformasjon>
                <FormattedHTMLMessage id={spm.forklaring} />
              </UtvidetInformasjon>
            </div>
            <img alt={'checkmark'} src={checkMark} />
            <span> {hentTekstForSvar(spm.svar)} </span>
          </section>
        );
      })}
    </>
  );
};

export default SporsmalOgSvarVisning;
