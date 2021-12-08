import { AppEpic } from '../store/configureStore';
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { fetchKorrigertId } from '../api/api';
import { from, of } from 'rxjs';
import { InnsendingActions } from '../actions/innsending';
import { isActionOf } from 'typesafe-actions';
import { MeldekortActions } from '../actions/meldekort';
import { postMeldekort } from '../api/api';

const hentKorrigertId: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([InnsendingActions.hentKorrigertId.request])),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      from(fetchKorrigertId(state.aktivtMeldekort.meldekortId)).pipe(
        map(InnsendingActions.hentKorrigertId.success),
        catchError(error =>
          of(
            InnsendingActions.hentKorrigertId.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

const kontrollerMeldekort: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([InnsendingActions.kontrollerMeldekort.request])),
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

export default combineEpics(hentKorrigertId, kontrollerMeldekort);
