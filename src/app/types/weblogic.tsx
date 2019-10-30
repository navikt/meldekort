import { Infomelding } from './meldekort';

export interface WeblogicPing {
  erWeblogicOppe: Boolean;
  melding: Infomelding | null;
}
