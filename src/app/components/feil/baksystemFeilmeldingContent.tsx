import * as React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

export const baksystemFeilmeldingContent = () => {
    return (
        <div>
            <Undertittel children={'Feil i baksystem'}/>
            <Normaltekst className="sentrert">
                Vi har problemer med å nå baksystemene våre for øyeblikket,
                og kan derfor ikke vise deg meldekortene dine. Prøv igjen senere.
            </Normaltekst>
        </div>
    );
};