import { AppEpic } from '../store/configureStore';
import { catchError, concatMap, filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { KontrollerActions } from '../actions/innsending';
import { ValideringsResultat } from '../types/meldekort';
import { postMeldekort } from '../api/api';
import { fromAsync } from '../utils/epicUtils';
import { of } from 'rxjs';
import { MeldekortActions } from '../actions/meldekort';
import { combineEpics } from 'redux-observable';

const kontrollerMeldekort: AppEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(KontrollerActions.kontrollerMeldekort.request)),
        withLatestFrom(state$),
        concatMap(([action, state]) =>
            fromAsync( async () => {
                return await postMeldekort(state.innsending.meldekortdetaljerInnsending!);

            }).pipe(
                mergeMap( (valideringsresultat: ValideringsResultat) => {
                   return [
                       KontrollerActions.kontrollerMeldekort.success(valideringsresultat),
                   ];
                }),
                catchError( error =>
                    of(KontrollerActions.kontrollerMeldekort.failure(error), MeldekortActions.apiKallFeilet(error))
                )
            )
        )
    );

export default combineEpics(kontrollerMeldekort);