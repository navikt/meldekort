import * as React from 'react';
import { formatMessage, hentIntl } from '../../../utils/intlUtil';
import { MeldekortDag } from '../../../types/meldekort';

interface Props {
  meldekortDag: MeldekortDag;
  typeYtelsePostfix: string;
}

const Hjelpetekst: React.FunctionComponent<Props> = ({
  meldekortDag,
  typeYtelsePostfix,
}) => {
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
        {formatMessage(forklaringTekstid + typeYtelsePostfix)}
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
