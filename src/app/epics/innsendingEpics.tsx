import { AppEpic } from '../store/configureStore';
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { postMeldekort } from '../api/api';
import { from, of } from 'rxjs';
import { InnsendingActions } from '../actions/innsending';
import { MeldekortActions } from '../actions/meldekort';
import { isActionOf } from 'typesafe-actions';

const kontrollerMeldekort: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(InnsendingActions.kontrollerMeldekort.request)),
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
