import { Infomelding } from './meldekort';

export interface WeblogicPing {
  erWeblogicOppe: boolean;
  melding: Infomelding | null;
}
