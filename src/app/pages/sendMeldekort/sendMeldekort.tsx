import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';

class SendMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {

        return(
            <div className="sendMeldekort-innhold">
                <Innholdstittel> Send Meldekort siden </Innholdstittel>
            </div>
        );
    }
}

export default SendMeldekort;
