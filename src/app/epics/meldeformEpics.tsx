import { AppEpic } from '../store/configureStore';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { postEndreMeldeform } from '../api/api';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { MeldeformActions } from '../actions/meldeform';
import { MeldekortActions } from '../actions/meldekort';
import { UiActions } from '../actions/ui';
import { endreMeldeformBekreftelseContent } from '../components/modal/endreMeldeformBekreftelseContent';

const endreMeldeform: AppEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf([MeldeformActions.endreMeldeform.request])),
        withLatestFrom(state$),
        switchMap(([action]) =>
            from(postEndreMeldeform(action.payload)).pipe(
                map(MeldeformActions.endreMeldeform.success),
                catchError(error =>
                    of(MeldeformActions.endreMeldeform.failure(error), MeldekortActions.apiKallFeilet(error))
                )
            )
        )
    );

const handterEndretMeldeformBekreftelse: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(MeldeformActions.endreMeldeform.success)),
        concatMap(action => {
            return [
                UiActions.visModal({
                    content: () => endreMeldeformBekreftelseContent(),
                    visModal: true
                }),
            ];
        })
    );

export default combineEpics(endreMeldeform, handterEndretMeldeformBekreftelse);