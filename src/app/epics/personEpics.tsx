import { AppEpic } from '../store/configureStore';
import { PersonActions } from '../actions/person';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { fetchMeldekort } from '../api/api';
import { combineEpics, ofType } from 'redux-observable';
import { MeldekortActions } from '../actions/meldekort';

const hentPerson: AppEpic = action$ =>
  action$.pipe(
    ofType(PersonActions.hentPerson.request),
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
