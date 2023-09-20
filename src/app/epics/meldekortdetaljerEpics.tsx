import { AppEpic } from '../store/configureStore';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { MeldekortdetaljerActions } from '../actions/meldekortdetaljer';
import { from, of } from 'rxjs';
import { fetchMeldekortdetaljer } from '../api/api';
import { combineEpics, ofType } from 'redux-observable';
import { MeldekortActions } from '../actions/meldekort';

const hentMeldekortdetaljer: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType([MeldekortdetaljerActions.hentMeldekortdetaljer.request]),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      from(fetchMeldekortdetaljer(state.aktivtMeldekort.meldekortId)).pipe(
        map(MeldekortdetaljerActions.hentMeldekortdetaljer.success),
        catchError(error =>
          of(
            MeldekortdetaljerActions.hentMeldekortdetaljer.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(hentMeldekortdetaljer);
