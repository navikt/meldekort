import * as React from "react";
import {hentIntl} from "../../utils/intlUtil";
import {Flatknapp} from "nav-frontend-knapper";
import printLogo from '../../ikoner/print.svg';

const PrintKnapp: React.FunctionComponent = () => {

    const tekst = hentIntl().formatMessage({id: 'overskrift.skrivUt'});

    const print = () => {
        window.print();
    };

    return (
        <>
        <Flatknapp onClick={print}>
            <img className="printLogo" src={printLogo} alt={tekst + ' logo'}/>
            {tekst}
        </Flatknapp>
        </>
    )
}

export default PrintKnapp;