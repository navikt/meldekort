import { AppEpic } from '../store/configureStore';
import { isActionOf } from 'typesafe-actions';
import { PersonActions } from '../actions/person';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { hentMeldekort } from '../api/api';
import { combineEpics } from 'redux-observable';

const hentPerson: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(PersonActions.hentPerson.request)),
        switchMap(() =>
            from(hentMeldekort()).pipe(
                map(PersonActions.hentPerson.success),
                catchError(error =>
                    of(PersonActions.hentPerson.failure())
                )
            )
        )
    );

export default combineEpics(hentPerson);