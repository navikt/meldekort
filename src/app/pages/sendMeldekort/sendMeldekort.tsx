import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { hentMeldekort } from '../../api/api';

class SendMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const mk = hentMeldekort();
        return(
            <div className="sideinnhold">
                <Innholdstittel> Send Meldekort siden </Innholdstittel>
                {/*<span>{mk}</span>*/console.log(mk)}
            </div>
        );
    }
}

export default SendMeldekort;
