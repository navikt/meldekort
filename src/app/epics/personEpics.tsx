import { AppEpic } from "../store/configureStore";
import { PersonActions } from "../actions/person";
import { from, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { fetchMeldekort } from "../api/api";
import { combineEpics } from "redux-observable";
import { MeldekortActions } from "../actions/meldekort";
import { isActionOf } from "typesafe-actions";

const hentPerson: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(PersonActions.hentPerson.request)),
    switchMap(() =>
      from(fetchMeldekort()).pipe(
        map(PersonActions.hentPerson.success),
        catchError(error =>
          of(
            PersonActions.hentPerson.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(hentPerson);
