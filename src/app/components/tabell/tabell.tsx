import * as React from 'react';

interface TabellProps {
    rows: {}[];
    columns: {}[];
    className?: string;
}

const Tabell: React.FunctionComponent<TabellProps> = (props) => {
    const JsonTable = require('ts-react-json-table');

    return (
        <JsonTable
            rows={props.rows}
            columns={props.columns}
            className={props.className}
        />
    );
};

export default Tabell;