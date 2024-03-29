import * as React from "react";
import { browserName, browserVersion, OSName } from "../../utils/browsers";
import { Nettlesere } from "../../utils/consts";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { Alert } from "@navikt/ds-react";

const GammelNettleserMelding: React.FunctionComponent = () => {
  const browser = browserName + " v. " + browserVersion;
  const chrome = () => {
    return (
      <a href={Nettlesere.chrome} target={"_blank"} rel={"noopener noreferrer"}>
        Chrome
      </a>
    );
  };
  const firefox = () => {
    return (
      <a
        href={Nettlesere.firefox}
        target={"_blank"}
        rel={"noopener noreferrer"}
      >
        Firefox
      </a>
    );
  };
  const edge = () => {
    return (
      <a href={Nettlesere.edge} target={"_blank"} rel={"noopener noreferrer"}>
        Microsoft Edge
      </a>
    );
  };

  const lenker = () => {
    switch (browserName) {
      case "Chrome":
        return chrome();
      case "Firefox":
        return firefox();
      case "Microsoft Edge":
      case "Internet Explorer":
        return edge();
      default:
        return (
          <span>
            {chrome()}, {firefox()}
            {OSName === "Windows" ? <span>, {edge()}</span> : ""}
          </span>
        );
    }
  };

  return (
    <div className={"gammelNettleser"}>
      <Alert variant="error">
        {formatHtmlMessage("gammelNettleser.melding", { 0: browser })}
        {lenker()}
      </Alert>
    </div>
  );
};

export default GammelNettleserMelding;
