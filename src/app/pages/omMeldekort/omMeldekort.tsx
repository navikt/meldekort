import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';

class OmMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel> Om meldekort</Innholdstittel>
            </div>
        );
    }
}

export default OmMeldekort;
