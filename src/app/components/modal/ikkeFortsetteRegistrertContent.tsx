import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';
import { formatMessage } from "../../utils/intlUtil";

export const ikkeFortsetteRegistrertContent = () => {
  return (
    <div className="modal-overskrift">
      <Undertittel>{formatMessage("sporsmal.bekreft")}</Undertittel>
      <Veilederpanel fargetema="advarsel" svg={<img alt="" src={veileder} />}>
        <div className="modal-tekst">
          <Normaltekst>
            {formatMessage("sporsmal.bekreftelse")}
          </Normaltekst>
        </div>
      </Veilederpanel>
    </div>
  );
};
