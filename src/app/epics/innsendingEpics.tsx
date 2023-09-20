import { AppEpic } from '../store/configureStore';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import { postMeldekort } from '../api/api';
import { from, of } from 'rxjs';
import { InnsendingActions } from '../actions/innsending';
import { MeldekortActions } from '../actions/meldekort';

const kontrollerMeldekort: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType([InnsendingActions.kontrollerMeldekort.request]),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      from(postMeldekort(state)).pipe(
        map(InnsendingActions.kontrollerMeldekort.success),
        catchError(error =>
          of(
            InnsendingActions.kontrollerMeldekort.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(kontrollerMeldekort);
