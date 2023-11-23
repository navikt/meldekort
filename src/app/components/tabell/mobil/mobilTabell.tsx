import * as React from 'react';
import { finnRiktigEtikettKlasse } from '../../../utils/statusEtikettUtil';
import EtikettBase from 'nav-frontend-etiketter';
import Komponentlenke from '../../komponentlenke/komponentlenke';
import { DetaljRad, HistoriskeMeldekortRad, MeldekortKolonne } from '../../../types/meldekort';
import { mapKortStatusTilTekst } from '../../../utils/kortMapper';
import { Konstanter } from "../../../utils/consts";

interface MobilTabellProps {
  rows?: HistoriskeMeldekortRad[];
  row?: DetaljRad;
  columns: MeldekortKolonne[];
  className?: string;
}

const MobilTabell: React.FunctionComponent<MobilTabellProps> = props => {
  const returnerTabellRader = (
    header: MeldekortKolonne,
    rowData: HistoriskeMeldekortRad
  ) => {
    let tableData = null

    for (const i in rowData) {
      if (i === header.key && header.key === 'status') {
        tableData = (
          <EtikettBase
            type={'info'}
            className={finnRiktigEtikettKlasse(rowData[i])}
          >
            {mapKortStatusTilTekst(rowData[i])}
          </EtikettBase>
        );
      } else if (
        i === header.key &&
        header.key === 'periode' &&
        rowData.periode
      ) {
        tableData = (
          <Komponentlenke
            lenketekst={rowData.periode}
            rute={Konstanter.basePath + "/tidligere-meldekort/detaljer"}
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
    header: MeldekortKolonne,
    rowData: DetaljRad
  ) => {
    let tableData = null

    for (const i in rowData) {
      if (i === header.key && header.key === 'kortStatus') {
        tableData = (
          <EtikettBase
            type={'info'}
            className={finnRiktigEtikettKlasse(rowData[i])}
          >
            {mapKortStatusTilTekst(rowData[i])}
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
    if (props.row) {
      const test2: DetaljRad = props.row;
      resultat = props.columns.map(colHeader =>
        returnerDetaljRad(colHeader, test2)
      );
    }
    return resultat;
  };

  const visFlereTabeller = () => {
    let tabeller;
    if (props.rows) {
      tabeller = props.rows.map((allRowData: HistoriskeMeldekortRad) => (
        <table key={allRowData.meldekort.meldekortId} className={'mobilTabell'}>
          <tbody>
            {props.columns.map(colHeader =>
              returnerTabellRader(colHeader, allRowData)
            )}
          </tbody>
        </table>
      ));
    }
    return tabeller;
  };

  return (
    <div className={'mobilTabell-container'}>
      {props.row ? (
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
