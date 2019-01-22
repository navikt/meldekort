import { action } from 'typesafe-actions';
import { Constants, Meldekort } from '../types/meldekort';

export function leggTilMeldekort(mk: Meldekort) {
    return action(Constants.LEGG_TIL_MELDEKORT, {
        mk
    });
}