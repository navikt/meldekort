import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { WeblogicActions } from '../actions/skrivemodus';
import { fetchSkrivemodus } from '../api/api';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics } from 'redux-observable';

const pingWeblogicEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(WeblogicActions.pingWeblogic.request)),
    switchMap(() =>
      from(fetchSkrivemodus()).pipe(
        map(WeblogicActions.pingWeblogic.success),
        catchError(error =>
          of(
            WeblogicActions.pingWeblogic.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(pingWeblogicEpic);
