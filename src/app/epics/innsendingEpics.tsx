import { AppEpic } from '../store/configureStore';
import { catchError, filter, concatMap, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { fetchKorrigertId } from '../api/api';
import { from, of } from 'rxjs';
import { fromAsync } from '../utils/epicUtils';
import { InnsendingActions } from '../actions/innsending';
import { isActionOf } from 'typesafe-actions';
import { MeldekortActions } from '../actions/meldekort';
import { postMeldekort } from '../api/api';
import { ValideringsResultat } from '../types/meldekort';

const hentKorrigertId: AppEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf([InnsendingActions.hentKorrigertId.request])),
        withLatestFrom(state$),
        switchMap(([action, state]) =>
            from(fetchKorrigertId(state.aktivtMeldekort.meldekort.meldekortId)).pipe(
                map(InnsendingActions.hentKorrigertId.success),
                catchError(error =>
                    of(InnsendingActions.hentKorrigertId.failure(error), MeldekortActions.apiKallFeilet(error))
                )
            )
        )
    );

/*const kontrollerMeldekort: AppEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(InnsendingActions.kontrollerMeldekort.request)),
        withLatestFrom(state$),
        concatMap(([action, state]) =>
            fromAsync( async () => {
                return await postMeldekort(state.innsending.meldekortdetaljerInnsending!);

            }).pipe(
                mergeMap( (valideringsresultat: ValideringsResultat) => {
                   return [
                       InnsendingActions.kontrollerMeldekort.success(valideringsresultat),
                   ];
                }),
                catchError( error =>
                    of(InnsendingActions.kontrollerMeldekort.failure(error), MeldekortActions.apiKallFeilet(error))
                )
            )
        )
    );*/

const kontrollerMeldekort: AppEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf([InnsendingActions.kontrollerMeldekort.request])),
        withLatestFrom(state$),
        switchMap(([action, state]) =>
                      from(postMeldekort(state.innsending.meldekortdetaljerInnsending!)).pipe(
                          map(InnsendingActions.kontrollerMeldekort.success),
                          catchError(error =>
                                         of(InnsendingActions.kontrollerMeldekort.failure(error), MeldekortActions.apiKallFeilet(error))
                          )
                      )
        )
    );

export default combineEpics(hentKorrigertId, kontrollerMeldekort);