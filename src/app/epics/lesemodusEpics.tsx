import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { LesemodusActions } from '../actions/lesemodus';
import { lesemodus } from '../api/api';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics } from 'redux-observable';

const lesemodusEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(LesemodusActions.lesemodus.request)),
    switchMap(() =>
      from(lesemodus()).pipe(
        map(LesemodusActions.lesemodus.success),
        catchError(error =>
          of(
            LesemodusActions.lesemodus.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(lesemodusEpic);
