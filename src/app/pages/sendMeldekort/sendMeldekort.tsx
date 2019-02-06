import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { hentMeldekort } from '../../api/api';

class SendMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    hentMeldekortForBruker() {
        return hentMeldekort();
    }

    render() {
        console.log(this.hentMeldekortForBruker());
        return(
            <div className="sideinnhold">
                <Innholdstittel> Send Meldekort siden </Innholdstittel>
            </div>
        );
    }
}

export default SendMeldekort;
