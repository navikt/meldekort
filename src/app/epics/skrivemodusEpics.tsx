import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { SkrivemodusActions } from '../actions/skrivemodus';
import { fetchSkrivemodus } from '../api/api';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';

const hentSkrivemodusEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(SkrivemodusActions.hentSkrivemodus.request)),
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
