import { AppEpic } from '../store/configureStore';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { fetchKorrigertId } from '../api/api';
import { combineEpics } from 'redux-observable';
import { InnsendingActions } from '../actions/innsending';

                    // TODO: sett inn MeldekortActions.feilet lalal
const hentKorrigertId: AppEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf([InnsendingActions.hentKorrigertId.request])),
        withLatestFrom(state$),
        switchMap(([action, state]) =>
            from(fetchKorrigertId(state.aktivtMeldekort.meldekort.meldekortId)).pipe(
                map(InnsendingActions.hentKorrigertId.success),
                catchError(error =>
                    of(InnsendingActions.hentKorrigertId.failure(error))
                )
            )
        )
    );

export default combineEpics(hentKorrigertId);