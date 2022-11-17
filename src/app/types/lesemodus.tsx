import { Infomelding } from './meldekort';

export interface Lesemodus {
  lesemodus: boolean;
  melding: Infomelding | null;
}
