import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';

class EndreMeldeform extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel> Ofte stilte spørsmål</Innholdstittel>
            </div>
        );
    }
}

export default EndreMeldeform;