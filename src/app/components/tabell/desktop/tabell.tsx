import * as React from "react";
import { MeldekortKolonne } from "../../../types/meldekort";

interface TabellProps {
  rows: object[];
  columns: MeldekortKolonne[];
  className?: string;
}

const Tabell: React.FunctionComponent<TabellProps> = props => {
  // TODO: Update ts-react-json-table?
  /* eslint-disable @typescript-eslint/no-var-requires */
  const JsonTable = require("ts-react-json-table");

  return (
    <div className={"tabell"}>
      <JsonTable
        rows={props.rows}
        columns={props.columns}
        className={props.className}
      />
    </div>
  );
};

export default Tabell;
