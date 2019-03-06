import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veilederAdvarsel from '../../ikoner/veileder_advarsel.svg';

export const loggInnContent = () => {
    return (
        <div className="modal-overskrift">
            <Undertittel children={'Du må logge inn'}/>
            <Veilederpanel fargetema="advarsel" svg={<img src={veilederAdvarsel}/>}>
                <div className="modal-tekst">
                <Normaltekst>
                    Du er ikke logget inn. Vi viderefører deg til innloggingsiden.
                </Normaltekst>
                </div>
            </Veilederpanel>
        </div>
    );
};