import { AppEpic } from '../store/configureStore';
import { isActionOf } from 'typesafe-actions';
import { PersonActions } from '../actions/person';
import { from, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { fetchMeldekort, postEndreMeldeform } from '../api/api';
import { combineEpics } from 'redux-observable';
import { MeldekortActions } from '../actions/meldekort';

const hentPerson: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(PersonActions.hentPerson.request)),
        switchMap(() =>
            from(fetchMeldekort()).pipe(
                map(PersonActions.hentPerson.success),
                catchError(error =>
                    of(PersonActions.hentPerson.failure(error), MeldekortActions.apiKallFeilet(error))
                )
            )
        )
    );

export default combineEpics(hentPerson);