import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';

export const loggInnContent = () => {
    return (
        <div>
            <Undertittel children={'Du må logge inn'}/>
            <Normaltekst>
                Du er ikke logget inn. Vi viderefører deg til innloggingsiden.
            </Normaltekst>
        </div>
    );
};