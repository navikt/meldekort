import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { SkrivemodusActions } from '../actions/skrivemodus';
import { skrivemodus } from '../api/api';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics } from 'redux-observable';

const skrivemodusEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(SkrivemodusActions.skrivemodus.request)),
    switchMap(() =>
      from(skrivemodus()).pipe(
        map(SkrivemodusActions.skrivemodus.success),
        catchError(error =>
          of(
            SkrivemodusActions.skrivemodus.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(skrivemodusEpic);
