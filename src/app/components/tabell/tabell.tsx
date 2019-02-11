import * as React from 'react';

interface TabellProps {
    rows: {}[];
    columns: {}[];
    className?: string;
}

const Tabell: React.StatelessComponent<TabellProps> = (props) => {
    // const rows = props.rows.map( r => (<Normaltekst> {r} </Normaltekst>));
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