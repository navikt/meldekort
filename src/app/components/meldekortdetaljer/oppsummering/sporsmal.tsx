import * as React from 'react';
import { SporsmalOgSvar } from '../../../types/meldekort';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import checkMark from '../../../ikoner/check.svg';
import UtvidetInformasjon from '../../utvidetinformasjon/utvidetInformasjon';

interface Props {
  sporsmalOgSvar: SporsmalOgSvar[];
}

const Sporsmal: React.FunctionComponent<Props> = props => {
  const hentTekstForSvar = (svar: boolean) => {
    if (svar) {
      return <FormattedMessage id="diverse.ja" />;
    }
    return <FormattedMessage id="diverse.nei" />;
  };

  return (
    <>
      {props.sporsmalOgSvar.map(sporsmalOgSvar => {
        return (
          <section key={sporsmalOgSvar.sporsmalId} className="sporsmalsgruppe">
            <div className="flex-sporsmal-hjelpetekst-container">
              <Undertittel>
                <FormattedMessage id={sporsmalOgSvar.sporsmalId} />
                {sporsmalOgSvar.formatertDato ? <span>{sporsmalOgSvar.formatertDato}?</span> : null}
              </Undertittel>
              <UtvidetInformasjon>
                <FormattedHTMLMessage id={sporsmalOgSvar.forklaring} />
              </UtvidetInformasjon>
            </div>
            <img alt={'checkmark'} src={checkMark} />
            <span> {hentTekstForSvar(sporsmalOgSvar.svar)} </span>
          </section>
        );
      })}
    </>
  );
};

export default Sporsmal;
