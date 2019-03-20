import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veilederAdvarsel from '../../ikoner/veileder_advarsel.svg'
import { FormattedMessage } from 'react-intl';

export const loggInnContent = () => {
    return (
        <div className="modal-overskrift">
            <Undertittel children={<FormattedMessage id={'melding.loggInn.overskrift'}/>}/>
            <Veilederpanel fargetema="advarsel" svg={<img src={veilederAdvarsel}/>}>
                <div className="modal-tekst">
                <Normaltekst>
                    <FormattedMessage id={'melding.loggInn'}/>
                </Normaltekst>
                </div>
            </Veilederpanel>
        </div>
    );
};