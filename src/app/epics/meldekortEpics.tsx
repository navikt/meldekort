import { AppEpic } from '../store/configureStore';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap } from 'rxjs/operators';
import { HistoriskeMeldekortActions } from '../actions/historiskeMeldekort';
import { InnsendingActions } from '../actions/innsending';
import { isActionOf } from 'typesafe-actions';
import { MeldekortActions } from '../actions/meldekort';
import { MeldekortdetaljerActions } from '../actions/meldekortdetaljer';
import { PersonActions } from '../actions/person';
import { PersonStatusActions } from '../actions/personStatus';
import { UiActions } from '../actions/ui';
import { fetchInfomelding } from '../api/api';

// Lista i isActionOf må inneholde alle actions som skal fjerne feilmelding.
const fjernFeilmelding: AppEpic = action$ =>
  action$.pipe(
    filter(
      isActionOf([
        HistoriskeMeldekortActions.hentHistoriskeMeldekort.success,
        InnsendingActions.hentKorrigertId.success,
        InnsendingActions.kontrollerMeldekort.success,
        MeldekortdetaljerActions.hentMeldekortdetaljer.success,
        PersonActions.hentPerson.success,
        PersonStatusActions.hentPersonStatus.success,
      ])
    ),
    concatMap(action => {
      return [
        UiActions.visBaksystemFeilmelding({
          content: () => '',
          visFeilmelding: false,
        }),
      ];
    })
  );

const sjekkOmBrukerHarTidligereMeldekort: AppEpic = action$ =>
  action$.pipe(
    filter(
      isActionOf(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success)
    ),
    concatMap(action => {
      if (action.payload.length === 0) {
        return [
          UiActions.sjekkTidligereMeldekort({
            harTidligereMeldekort: false,
          }),
        ];
      } else {
        return [
          UiActions.sjekkTidligereMeldekort({
            harTidligereMeldekort: true,
          }),
        ];
      }
    })
  );

const hentInfomelding: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(MeldekortActions.hentInfomelding.request)),
    switchMap(() =>
      from(fetchInfomelding()).pipe(
        map(MeldekortActions.hentInfomelding.success),
        catchError(error =>
          of(
            MeldekortActions.hentInfomelding.failure(error),
            MeldekortActions.apiKallFeilet(error)
          )
        )
      )
    )
  );

export default combineEpics(
  fjernFeilmelding,
  sjekkOmBrukerHarTidligereMeldekort,
  hentInfomelding
);
