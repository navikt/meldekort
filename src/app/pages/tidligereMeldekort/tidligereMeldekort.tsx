import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';

class TidligereMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="tidligereMeldekort-innhold">
                <Innholdstittel> Tidligere meldekort</Innholdstittel>
            </div>
        );
    }
}

export default TidligereMeldekort;
