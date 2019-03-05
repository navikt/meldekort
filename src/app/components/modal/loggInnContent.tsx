import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veilederAdvarsel from '../ikoner/veilder_advarsel.svg';

export const loggInnContent = () => {
    return (
        <div>
            <Veilederpanel fargetema="advarsel" svg={<img src={veilederAdvarsel}/>}>
                <Undertittel children={'Du må logge inn'}/>
                <Normaltekst>
                    Du er ikke logget inn. Vi viderefører deg til innloggingsiden.
                </Normaltekst>
            </Veilederpanel>
        </div>
    );
};