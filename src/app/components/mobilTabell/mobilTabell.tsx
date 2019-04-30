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
        <div className={'mobilTabell_alle'}>
            {props.rows.map( rowCol => (
                <table>
                    {props.columns.map((tableRow, index) => (
                        <tr>
                            <th> {rowCol} </th>
                            <td> {tableRow} </td>
                        </tr>
                    ))}
                </table>
            ))
            }
        </div>
    );
};

export default MobilTabell;