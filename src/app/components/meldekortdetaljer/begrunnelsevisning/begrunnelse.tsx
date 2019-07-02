import * as React from 'react';
import { RootState } from '../../../store/configureStore';
import { connect } from 'react-redux';
import UtvidetInformasjon from '../../utvidetinformasjon/utvidetInformasjon';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import checkMark from '../../../ikoner/check.svg';

interface Props {
  begrunnelse: string;
}

const BegrunnelseVisning: React.FunctionComponent<Props> = props => {
  if (typeof props.begrunnelse !== 'undefined') {
    const begrunnelse = String(props.begrunnelse);
    if (begrunnelse.length > 0) {
      return (
        <section className="seksjon">
          <div className="flex-sporsmal-hjelpetekst-container">
            <Undertittel>
              <FormattedMessage id={'korrigering.sporsmal.begrunnelse'} />
            </Undertittel>
            <UtvidetInformasjon>
              <FormattedHTMLMessage id={'forklaring.sporsmal.begrunnelse'} />
            </UtvidetInformasjon>
          </div>
          <img alt={'checkmark'} src={checkMark} />
          <span>{props.begrunnelse}</span>
        </section>
      );
    }
  }
  return null;
};

export default BegrunnelseVisning;
