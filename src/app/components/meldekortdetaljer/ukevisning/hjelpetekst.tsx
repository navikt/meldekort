import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { hentIntl } from '../../../utils/intlUtil';
import { MeldekortDag } from '../../../types/meldekort';

interface Props {
  meldekortDag: MeldekortDag;
  erAap: boolean;
}

const Hjelpetekst: React.FunctionComponent<Props> = props => {
  let aap = '';

  if (props.erAap) {
    aap = '-AAP';
  }

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
      {props.meldekortDag.arbeidetTimerSum > 0
        ? hentTekst('utfylling.arbeid', 'forklaring.utfylling.arbeid')
        : null}
      {props.meldekortDag.kurs
        ? hentTekst('utfylling.tiltak', 'forklaring.utfylling.tiltak')
        : null}
      {props.meldekortDag.syk ? hentTekst('utfylling.syk', 'forklaring.utfylling.syk') : null}
      {props.meldekortDag.annetFravaer
        ? hentTekst('utfylling.ferieFravar', 'forklaring.utfylling.ferieFravar')
        : null}
    </span>
  );
};

export default Hjelpetekst;
