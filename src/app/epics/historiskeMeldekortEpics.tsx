import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { HistoriskeMeldekortActions } from '../actions/historiskeMeldekort';
import { from, of } from 'rxjs';
import { fetchHistoriskeMeldekort } from '../api/api';
import { combineEpics } from 'redux-observable';
import { MeldekortActions } from '../actions/meldekort';
import { isActionOf } from 'typesafe-actions';

const hentHistoriskeMeldekort: AppEpic = action$ =>
  action$.pipe(
    filter(
      isActionOf(HistoriskeMeldekortActions.hentHistoriskeMeldekort.request)
    ),
    switchMap(() =>
      from(fetchHistoriskeMeldekort()).pipe(
        map(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success),
        catchError(error =>
          of(
            HistoriskeMeldekortActions.hentHistoriskeMeldekort.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(hentHistoriskeMeldekort);
