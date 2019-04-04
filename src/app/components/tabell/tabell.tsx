import * as React from 'react';
import MobilTabell from '../mobilTabell/mobilTabell';

interface TabellProps {
    rows: {}[];
    columns: {}[];
    className?: string;
    mobilSkjerm?: boolean;
}

const Tabell: React.FunctionComponent<TabellProps> = (props) => {
    const JsonTable = require('ts-react-json-table');
    const tabellClass = props.mobilSkjerm ? 'tabell mobilversjon' : 'tabell';

    return (
        <>
        {!props.mobilSkjerm ? (
            <MobilTabell
                rows={props.rows}
                columns={props.columns}
            />
        ) : (
            <div className={tabellClass}>
                <JsonTable
                    rows={props.rows}
                    columns={props.columns}
                    className={props.className}
                />
            </div>
        )}
        </>
    );
};

export default Tabell;