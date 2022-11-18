import { Infomelding } from './meldekort';

export interface WeblogicPing {
  skrivemodus: boolean;
  melding: Infomelding | null;
}
