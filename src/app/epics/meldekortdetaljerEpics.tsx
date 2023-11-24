import { AppEpic } from "../store/configureStore";
import { catchError, filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { MeldekortdetaljerActions } from "../actions/meldekortdetaljer";
import { from, of } from "rxjs";
import { fetchMeldekortdetaljer } from "../api/api";
import { combineEpics } from "redux-observable";
import { MeldekortActions } from "../actions/meldekort";
import { isActionOf } from "typesafe-actions";

const hentMeldekortdetaljer: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(MeldekortdetaljerActions.hentMeldekortdetaljer.request)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        console.debug(action)
        return from(fetchMeldekortdetaljer(state.aktivtMeldekort.meldekortId)).pipe(
          map(MeldekortdetaljerActions.hentMeldekortdetaljer.success),
          catchError(error =>
            of(
              MeldekortdetaljerActions.hentMeldekortdetaljer.failure(error),
              MeldekortActions.apiKallFeilet(error)
            )
          )
        )
      }
    )
  );

export default combineEpics(hentMeldekortdetaljer);
