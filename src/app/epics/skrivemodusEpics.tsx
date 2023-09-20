import { AppEpic } from '../store/configureStore';
import { catchError, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { SkrivemodusActions } from '../actions/skrivemodus';
import { fetchSkrivemodus } from '../api/api';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics, ofType } from 'redux-observable';

const hentSkrivemodusEpic: AppEpic = action$ =>
  action$.pipe(
    ofType(SkrivemodusActions.hentSkrivemodus.request),
    switchMap(() =>
      from(fetchSkrivemodus()).pipe(
        map(SkrivemodusActions.hentSkrivemodus.success),
        catchError(error =>
          of(
            SkrivemodusActions.hentSkrivemodus.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(hentSkrivemodusEpic);
