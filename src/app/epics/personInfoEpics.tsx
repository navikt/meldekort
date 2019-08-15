import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics } from 'redux-observable';
import { PersonInfoActions } from '../actions/personInfo';
import { fetchPersoninfo } from '../api/api';

const hentPersonInfo: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(PersonInfoActions.hentPersonInfo.request)),
    switchMap(() =>
      from(fetchPersoninfo()).pipe(
        map(PersonInfoActions.hentPersonInfo.success),
        catchError(error =>
          of(
            PersonInfoActions.hentPersonInfo.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(hentPersonInfo);
