import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { hentIntl } from '../../../utils/intlUtil';
import { MeldekortDag } from '../../../types/meldekort';
import { hentAapStreng } from '../../../utils/teksterUtil';

interface Props {
  meldekortDag: MeldekortDag;
  erAap: boolean;
}

const Hjelpetekst: React.FunctionComponent<Props> = ({
  meldekortDag,
  erAap,
}) => {
  const aap = hentAapStreng(erAap);

  const hentTekst = (utfyllingTekstid: string, forklaringTekstid: string) => {
    return (
      <span>
        <span className={'overskrift-hjelpetekst'}>
          <strong>
            {hentIntl()
              .formatMessage({ id: utfyllingTekstid })
              .toUpperCase()}
          </strong>
        </span>
        <FormattedHTMLMessage id={forklaringTekstid + aap} />
      </span>
    );
  };
  return (
    <span className={'meldekortdetaljer-utfyllt-hjelpetekster'}>
      {meldekortDag.arbeidetTimerSum > 0
        ? hentTekst('utfylling.arbeid', 'forklaring.utfylling.arbeid')
        : null}
      {meldekortDag.kurs
        ? hentTekst('utfylling.tiltak', 'forklaring.utfylling.tiltak')
        : null}
      {meldekortDag.syk
        ? hentTekst('utfylling.syk', 'forklaring.utfylling.syk')
        : null}
      {meldekortDag.annetFravaer
        ? hentTekst('utfylling.ferieFravar', 'forklaring.utfylling.ferieFravar')
        : null}
    </span>
  );
};

export default Hjelpetekst;
