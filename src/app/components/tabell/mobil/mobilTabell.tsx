import * as React from 'react';
import { finnRiktigEtikettKlasse } from '../../../utils/statusEtikettUtil';
import EtikettBase from 'nav-frontend-etiketter';
import Komponentlenke from '../../komponentlenke/komponentlenke';
import { DetaljRad, HistoriskeMeldekortRad } from '../../../types/meldekort';

interface MobilTabellProps {
  rows?: HistoriskeMeldekortRad[];
  row?: DetaljRad;
  columns: {
    key: string;
    label: JSX.Element;
    cell?: any;
  }[];
  className?: string;
}

const MobilTabell: React.FunctionComponent<MobilTabellProps> = (props) => {
  const returnerTabellRader = (
    header: { key: string; label: JSX.Element; cell?: any },
    rowData: HistoriskeMeldekortRad
  ) => {
    let tableData: any = '';
    for (let i in rowData) {
      if (i === header.key && header.key === 'status') {
        tableData = (
          <EtikettBase type={'info'} className={finnRiktigEtikettKlasse(rowData[i])}>
            {rowData[i]}
          </EtikettBase>
        );
      } else if (i === header.key && header.key === 'periode' && rowData.periode) {
        tableData = (
          <Komponentlenke
            lenketekst={rowData.periode}
            rute="/tidligere-meldekort/detaljer"
            meldekort={rowData.meldekort}
          />
        );
      } else if (i === header.key) {
        tableData = rowData[i];
      }
    }
    return (
      <tr key={header.key} className={'tabellRad'}>
        <th> {header.label} </th>
        <td> {tableData} </td>
      </tr>
    );
  };

  const returnerDetaljRad = (
    header: { key: string; label: JSX.Element; cell?: any },
    rowData: DetaljRad
  ) => {
    let tableData: any = '';

    for (let i in rowData) {
      if (i === header.key && header.key === 'kortStatus') {
        tableData = (
          <EtikettBase type={'info'} className={finnRiktigEtikettKlasse(rowData[i])}>
            {rowData[i]}
          </EtikettBase>
        );
      } else if (i === header.key) {
        tableData = rowData[i];
      }
    }
    return (
      <tr key={header.key} className={'tabellRad'}>
        <th> {header.label} </th>
        <td> {tableData} </td>
      </tr>
    );
  };
  const visEnTabell = () => {
    let resultat = {};
    if (typeof props.row !== undefined && props.row) {
      const test2: DetaljRad = props.row;
      resultat = props.columns.map((colHeader) => returnerDetaljRad(colHeader, test2));
    }
    return resultat;
  };

  const visFlereTabeller = () => {
    let tabeller;
    if (props.rows && typeof props.rows !== undefined) {
      tabeller = props.rows.map((allRowData: any) => (
        <table key={allRowData.meldekort.meldekortId} className={'mobilTabell'}>
          <tbody>
            {props.columns.map((colHeader) => returnerTabellRader(colHeader, allRowData))}
          </tbody>
        </table>
      ));
    }
    return tabeller;
  };

  return (
    <div className={'mobilTabell-container'}>
      {typeof props.row !== undefined && props.row ? (
        <table key={props.row.meldekortid} className={'mobilTabell'}>
          <tbody>{visEnTabell()}</tbody>
        </table>
      ) : (
        <>{visFlereTabeller()}</>
      )}
    </div>
  );
};

export default MobilTabell;
