import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { formatMessage } from "../../utils/intlUtil";

export const baksystemFeilmeldingContent = () => {
  return (
    <div>
      <Undertittel
        children={formatMessage("feilmelding.baksystem.overskrift")}
      />
      {formatMessage("feilmelding.baksystem")}
    </div>
  );
};
