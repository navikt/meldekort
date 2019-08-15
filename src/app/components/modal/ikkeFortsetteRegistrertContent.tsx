import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';
import { FormattedMessage } from 'react-intl';

export const ikkeFortsetteRegistrertContent = () => {
  return (
    <div className="modal-overskrift">
      <Undertittel children={<FormattedMessage id={'sporsmal.bekreft'} />} />
      <Veilederpanel fargetema="advarsel" svg={<img alt="" src={veileder} />}>
        <div className="modal-tekst">
          <Normaltekst>
            <FormattedMessage id={'sporsmal.bekreftelse'} />
          </Normaltekst>
        </div>
      </Veilederpanel>
    </div>
  );
};
