import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Hilsen from '../../components/sprakvelger/Hilsen';

class TidligereMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel> Tidligere meldekort</Innholdstittel>
                <Sprakvelger/>
                <Hilsen/>
            </div>
        );
    }
}

export default TidligereMeldekort;
