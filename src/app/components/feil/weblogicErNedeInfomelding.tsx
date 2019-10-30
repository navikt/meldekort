import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';

export const WeblogicErNedeInfomelding: React.FunctionComponent = () => {
  return (
    <AlertStripe type={'info'}>
      <FormattedMessage id={'weblogicNedeInfomelding'} />
    </AlertStripe>
  );
};
