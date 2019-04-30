import * as React from 'react';
import { HistoriskeMeldekortRad } from '../../sider/tidligereMeldekort/tidligereMeldekort';
import { finnRiktigEtikettType } from '../../utils/statusEtikettUtil';
import EtikettBase from 'nav-frontend-etiketter';
import Komponentlenke from '../../components/komponentlenke/komponentlenke';

interface MobilTabellProps {
    rows: HistoriskeMeldekortRad[];
    columns: {
        key: string,
        label: JSX.Element,
        cell: any}[];
    className?: string;
}

const MobilTabell: React.FunctionComponent<MobilTabellProps> = (props) => {

    const returnerTabellRad = (header: {key: string, label: JSX.Element, cell: any}, rowData: HistoriskeMeldekortRad) => {
        let tableData: any = '';
        for (let i in rowData) {
            if (i === header.key && header.key === 'status') {
                tableData = (
                    <EtikettBase type={finnRiktigEtikettType(rowData[i])}>
                        {rowData[i]}
                    </EtikettBase>);
            } else if (i === header.key && header.key === 'periode') {
                tableData = (
                    <Komponentlenke
                        lenketekst={rowData.periode}
                        rute="/tidligere-meldekort/detaljer"
                        meldekort={rowData.meldekort}
                    />
                );
                console.log();
            } else if (i === header.key ) {
                tableData = rowData[i];
            }
        }
        return (
            <tr key={header.key} className={'tabellRad'}>
                <th className={'headerCsol'}> {header.label} </th>
                <td className={'dataCol'}> {tableData} </td>
            </tr>
        );
    };

    return (
        <div className={'mobilTabell-container'}>
            {props.rows.map( allRowData => (
                <table key={allRowData.meldekort.meldekortId} className={'mobilTabell'}>
                    <tbody>
                    {props.columns.map((colHeader) => (
                        returnerTabellRad(colHeader, allRowData)
                    ))}
                    </tbody>
                </table>
            ))
            }
        </div>
    );
};

export default MobilTabell;