import { Infomelding } from "./meldekort";

export interface Skrivemodus {
  skrivemodus: boolean;
  melding: Infomelding | null;
}
