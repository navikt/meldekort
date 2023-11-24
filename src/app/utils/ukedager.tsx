import * as React from "react";
import { formatMessage } from "./intlUtil";
import Ingress from "nav-frontend-typografi/lib/ingress";

export const hentUkedagerSomStringListe = (): string[] => {
  return [
    formatMessage("ukedag.mandag").trim(),
    formatMessage("ukedag.tirsdag").trim(),
    formatMessage("ukedag.onsdag").trim(),
    formatMessage("ukedag.torsdag").trim(),
    formatMessage("ukedag.fredag").trim(),
    formatMessage("ukedag.lordag").trim(),
    formatMessage("ukedag.sondag").trim(),
  ];
};

// Fra mandag-søndag 0-6 til 1-0
export const konverterUkedag = (index: number): number => {
  return index === 6 ? 0 : index + 1;
};

export const hentUkedager = () => {
  return hentUkedagerSomStringListe().map((dag, index) => {
    return (
      <Ingress key={dag + index}>
        <abbr key={"ukedager-" + dag} title={dag}>
          {dag.toUpperCase()[0]}
        </abbr>
      </Ingress>
    );
  });
};
