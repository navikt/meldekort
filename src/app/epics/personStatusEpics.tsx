import { AppEpic } from '../store/configureStore';
import { isActionOf } from 'typesafe-actions';
import { PersonStatusActions } from '../actions/personStatus';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { fetchPersonstatus } from '../api/api';
import { combineEpics } from 'redux-observable';

const hentPersonStatus: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(PersonStatusActions.hentPersonStatus.request)),
        switchMap(() =>
            from(fetchPersonstatus()).pipe(
                map(PersonStatusActions.hentPersonStatus.success),
                catchError( error =>
                    of(PersonStatusActions.hentPersonStatus.failure(error))
                )
            )
        )
    );

export default combineEpics(hentPersonStatus);