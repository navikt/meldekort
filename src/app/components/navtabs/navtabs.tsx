import * as React from 'react';
// import { Link } from 'react-router-dom';
import Tabs from 'nav-frontend-tabs';
                    /*<Link to="/send-meldekort">Send meldekort</Link>
                    <Link to="/tidligere-meldekort">Tidligere meldekort</Link>
                    <Link to="/om-meldekort">Om meldekort</Link>
                    <Link to="/ofte-stilte-spørsmål">Ofte stilte spørsmål</Link>*/

const NavTabs = () => {

    return (
        <nav>
            <div>
                <Tabs />
            </div>
        </nav>
    );
};

export default NavTabs;
