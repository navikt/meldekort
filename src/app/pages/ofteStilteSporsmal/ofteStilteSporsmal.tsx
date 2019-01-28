import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';

class OfteStilteSporsmal extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel> Ofte stilte spørsmål</Innholdstittel>
                <Sprakvelger/>

            </div>
        );
    }
}

export default OfteStilteSporsmal;
