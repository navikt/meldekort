import * as React from 'react';
import { MenyPunkt } from '../../utils/menyConfig';

interface MobilMenyProps {
    menypunkter: MenyPunkt[];
}

const MobilMeny: React.FunctionComponent<MobilMenyProps> = () => {

    return (
        <nav className={'meldekort-mobile-nav'}>
            Mobilmeny
        </nav>
    );
};

export default MobilMeny;
