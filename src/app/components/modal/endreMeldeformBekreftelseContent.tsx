import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import veileder from '../../ikoner/veileder.svg';
import Veilederpanel from 'nav-frontend-veilederpanel';
import * as React from 'react';
import { hentIntl } from '../../utils/intlUtil';

export const endreMeldeformBekreftelseContent = () => {
  return (
    <div className={'modal-overskrift'}>
      <Undertittel
        children={<FormattedMessage id={'overskrift.bekreftelse'} />}
      />
      <Veilederpanel fargetema="suksess" svg={<img alt="" src={veileder} />}>
        <div className="modal-tekst">
          <Normaltekst>
            {`${hentIntl()
              .formatMessage({ id: 'endreMeldeform.valgtBytte' })
              .trim()}
                            ${hentIntl().formatMessage({
                              id: 'endreMeldeform.elektronisk',
                            })}`}
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage
              id={'endreMeldeform.kvittering.elektronisk.info'}
            />
          </Normaltekst>
        </div>
      </Veilederpanel>
    </div>
  );
};
