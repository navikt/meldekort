import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';

class TidligereMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel> Tidligere meldekort</Innholdstittel>
                <Sprakvelger/>
            </div>
        );
    }
}

export default TidligereMeldekort;
