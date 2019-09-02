import * as React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage } from 'react-intl';
import { browserName, browserVersion } from '../../utils/browsers';

const GammelNettleserMelding: React.FunctionComponent = () => {
  const browser = browserName + ' v. ' + browserVersion;
  return (
    <div className={'gammelNettleser'}>
      <AlertStripeAdvarsel>
        <FormattedHTMLMessage
          id="gammelNettleser.melding"
          values={{ 0: browser }}
        />
      </AlertStripeAdvarsel>
    </div>
  );
};

export default GammelNettleserMelding;
