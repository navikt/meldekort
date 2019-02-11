import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { hentHistoriskeMeldekort } from '../../api/api';

class TidligereMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        console.log(hentHistoriskeMeldekort());
        return(
            <div className="sideinnhold">
                <Innholdstittel> Tidligere meldekort</Innholdstittel>
                <Sprakvelger/>
            </div>
        );
    }
}

export default TidligereMeldekort;
