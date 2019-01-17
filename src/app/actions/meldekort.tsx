import { action } from 'typesafe-actions';
import { Constants } from '../types/meldekort';

export function leggTilMeldekort(item: string) {
    return action(Constants.LEGG_TIL_MELDEKORT, {
        item
    });
}