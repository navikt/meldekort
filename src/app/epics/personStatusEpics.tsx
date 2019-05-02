import { AppEpic } from '../store/configureStore';
import { isActionOf } from 'typesafe-actions';
import { PersonStatusActions } from '../actions/personStatus';
import { catchError, concatMap, filter, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { fetchPersonstatus } from '../api/api';
import { combineEpics } from 'redux-observable';
import { MeldekortActions } from '../actions/meldekort';

const hentPersonStatus: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(PersonStatusActions.hentPersonStatus.request)),
        switchMap(() =>
            from(fetchPersonstatus()).pipe(
                map(PersonStatusActions.hentPersonStatus.success),
                catchError( error =>
                    of(PersonStatusActions.hentPersonStatus.failure(error), MeldekortActions.apiKallFeilet(error))
                )
            )
        )
    );

export default combineEpics(hentPersonStatus);