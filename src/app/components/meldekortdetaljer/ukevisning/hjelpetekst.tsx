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
  return (
    <span className={'meldekortdetaljer-utfyllt-hjelpetekster'}>
      {props.meldekortDag.arbeidetTimerSum > 0 ? (
        <span>
          <span className={'overskrift-hjelpetekst'}>
            <strong>
              {hentIntl()
                .formatMessage({ id: 'utfylling.arbeid' })
                .toUpperCase()}
            </strong>
          </span>
          <FormattedHTMLMessage id={'forklaring.utfylling.arbeid' + aap} />
        </span>
      ) : null}
      {props.meldekortDag.kurs ? (
        <span>
          <span className={'overskrift-hjelpetekst'}>
            <strong>
              {hentIntl()
                .formatMessage({ id: 'utfylling.tiltak' })
                .toUpperCase()}
            </strong>
          </span>
          <FormattedHTMLMessage id={'forklaring.utfylling.tiltak' + aap} />
        </span>
      ) : null}
      {props.meldekortDag.syk ? (
        <span>
          <span className={'overskrift-hjelpetekst'}>
            <strong>
              {hentIntl()
                .formatMessage({ id: 'utfylling.syk' })
                .toUpperCase()}
            </strong>
          </span>
          <FormattedHTMLMessage id={'forklaring.utfylling.syk' + aap} />
        </span>
      ) : null}
      {props.meldekortDag.annetFravaer ? (
        <span>
          <span className={'overskrift-hjelpetekst'}>
            <strong>
              {hentIntl()
                .formatMessage({ id: 'utfylling.ferieFravar' })
                .toUpperCase()}
            </strong>
          </span>
          <FormattedHTMLMessage id={'forklaring.utfylling.ferieFravar' + aap} />
        </span>
      ) : null}
    </span>
  );
};

export default Hjelpetekst;
