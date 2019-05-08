import Environment from '../utils/env';
import tekster from '../tekster/kompilerte-tekster';
import { AppEpic } from '../store/configureStore';
import { AxiosResponse } from 'axios';
import { baksystemFeilmeldingContent } from '../components/feil/baksystemFeilmeldingContent';
import { combineEpics } from 'redux-observable';
import { concatMap, filter } from 'rxjs/operators';
import { HistoriskeMeldekortActions } from '../actions/historiskeMeldekort';
import { InnsendingActions } from '../actions/innsending';
import { isActionOf } from 'typesafe-actions';
import { loggInnContent } from '../components/modal/loggInnContent';
import { MeldeformActions } from '../actions/meldeform';
import { MeldekortActions } from '../actions/meldekort';
import { MeldekortdetaljerActions } from '../actions/meldekortdetaljer';
import { obsFeilmeldingContent } from '../components/feil/obsFeilmeldingContent';
import { PersonActions } from '../actions/person';
import { PersonStatusActions } from '../actions/personStatus';
import { UiActions } from '../actions/ui';
import { updateIntl } from 'react-intl-redux';

const handterFeiletApiKall: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(MeldekortActions.apiKallFeilet)),
        concatMap(action => {
            const axiosResponse: AxiosResponse | undefined = action.payload.response;
            if (
                axiosResponse &&
                axiosResponse.status !== undefined &&
                axiosResponse.status === 401
            ) {
                updateIntl({locale: 'nb', messages: tekster.nb });

                return [
                    UiActions.visModal({
                        content: () => loggInnContent(),
                        onRequestClose: () => {
                            window.location.assign(`${Environment().loginUrl}&redirect=${window.location.origin}/meldekort`);
                        },
                        visModal: true,
                    }),
                ];
            } else if (
                axiosResponse &&
                axiosResponse.status !== undefined &&
                axiosResponse.status === 500
            ) {
                return [
                    UiActions.visBaksystemFeilmelding({
                        content: () => baksystemFeilmeldingContent(),
                        visFeilmelding: true
                    }),
                ];
            } else if (
                axiosResponse &&
                axiosResponse.status !== undefined &&
                axiosResponse.status >= 400
            ) {
                return [
                    UiActions.visBaksystemFeilmelding({
                        content: () => obsFeilmeldingContent(),
                        visFeilmelding: true
                    }),
                ];
            }
            return [];
        })
    );

// Lista i isActionOf må inneholde alle actions som skal fjerne feilmelding.
const fjernFeilmelding: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf([
            HistoriskeMeldekortActions.hentHistoriskeMeldekort.success,
            InnsendingActions.hentKorrigertId.success,
            InnsendingActions.kontrollerMeldekort.success,
            MeldeformActions.endreMeldeform.success,
            MeldekortdetaljerActions.hentMeldekortdetaljer.success,
            PersonActions.hentPerson.success,
            PersonStatusActions.hentPersonStatus.success
        ])),
        concatMap( action => {
            return [
                UiActions.visBaksystemFeilmelding({
                    content: () => '',
                    visFeilmelding: false
                })
            ];
        })
    );

const sjekkOmBrukerHarTidligereMeldekort: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success)),
        concatMap(action => {
            if (action.payload.length === 0) {
                return [
                    UiActions.sjekkTidligereMeldekort({
                        harTidligereMeldekort: false
                    }),
                ];
            } else {
                return [
                    UiActions.sjekkTidligereMeldekort({
                        harTidligereMeldekort: true
                    }),
                ];
            }
        })
    );

export default combineEpics(
    handterFeiletApiKall,
    fjernFeilmelding,
    sjekkOmBrukerHarTidligereMeldekort,
);