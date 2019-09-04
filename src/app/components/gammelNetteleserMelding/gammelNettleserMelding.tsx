import * as React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage } from 'react-intl';
import { browserName, browserVersion } from '../../utils/browsers';
import { Nettlesere } from '../../utils/consts';

const GammelNettleserMelding: React.FunctionComponent = () => {
  const browser = browserName + ' v. ' + browserVersion;
  const chrome = () => {
    return (
      <a href={Nettlesere().chrome} target={'_blank'}>
        Chrome
      </a>
    );
  };
  const firefox = () => {
    return (
      <a href={Nettlesere().firefox} target={'_blank'}>
        Firefox
      </a>
    );
  };
  const edge = () => {
    return (
      <a href={Nettlesere().edge} target={'_blank'}>
        Microsoft Edge
      </a>
    );
  };

  const lenker = () => {
    switch (browserName) {
      case 'Chrome':
        return chrome();
      case 'Firefox':
        return firefox();
      case 'Microsoft Edge':
        return edge();
      default:
        return (
          <span>
            {chrome()}, {firefox()}, {edge()}
          </span>
        );
    }
  };
  return (
    <div className={'gammelNettleser'}>
      <AlertStripeAdvarsel>
        <FormattedHTMLMessage
          id="gammelNettleser.melding"
          values={{ 0: browser }}
        />
        {lenker()}
      </AlertStripeAdvarsel>
    </div>
  );
};

export default GammelNettleserMelding;
