import * as React from 'react';

import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';

const Meldekortdetaljer: React.FunctionComponent<MeldekortdetaljerState> = (props) => {

    return (
        <div>
            <p><span>MottattDato: </span><span>{props.meldekortdetaljer.meldeDato}</span></p>
        </div>
    );
};

export default Meldekortdetaljer;