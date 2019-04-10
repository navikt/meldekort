import * as React from 'react';
import { Tab } from '../meny/tabConfig';

interface MobilMenyProps {
    tabsobjekter: Tab[];
}

const MobilMeny: React.FunctionComponent<MobilMenyProps> = () => {

    return (
        <nav>
            Mobilmeny
        </nav>
    );
};

export default MobilMeny;
