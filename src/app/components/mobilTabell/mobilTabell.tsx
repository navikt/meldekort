import * as React from 'react';

// En liste for første kolonne (data navn)
// En liste for andre kolonne (selve dataen)
interface MobilTabellProps {
    rows: {}[];
    columns: {}[];
    className?: string;
}

const MobilTabell: React.FunctionComponent<MobilTabellProps> = (props) => {

    return (
        <>
            Hei
        </>
    );
};

export default MobilTabell;