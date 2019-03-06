import { AppEpic } from '../store/configureStore';
import { concatMap, filter } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { MeldekortActions } from '../actions/meldekort';
import { AxiosResponse } from 'axios';
import { UiActions } from '../actions/ui';
import { loggInnContent } from '../components/modal/loggInnContent';
import Environment from '../utils/env';
import { baksystemFeilmeldingContent } from '../components/feil/baksystemFeilmeldingContent';
import { combineEpics } from 'redux-observable';
import { HistoriskeMeldekortActions } from '../actions/historiskeMeldekort';

const handterFeiletApiKall: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(MeldekortActions.apiKallFeilet)),
        concatMap(action => {
            console.log('Inne i handter Feilet api kall');
            const axiosResponse: AxiosResponse | undefined = action.payload.response;
            console.log(axiosResponse);
            if (
                axiosResponse &&
                axiosResponse.status !== undefined &&
                axiosResponse.status === 401
            ) {
                return [
                    UiActions.visModal({
                        content: () => loggInnContent(),
                        onRequestClose: () => {
                            window.location.assign(`${Environment().loginUrl}&redirect=${window.location.origin}` + '/meldekort');
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
            }
            return [];
        })
    );

const sjekkOmBrukerHarTidligereMeldekort: AppEpic = action$ =>
    action$.pipe(
        filter(isActionOf(HistoriskeMeldekortActions.hentHistoriskeMeldekort.success)),
        concatMap(action => {
            console.log('Inni sjekk om bruker har tidligere meldekort');
            console.log(action.payload);
            if (action.payload.length === 0) {
                console.log('TidligereMeldekortListe er 0');
                return [
                    UiActions.sjekkTidligereMeldekort({
                        harTidligereMeldekort: false
                    }),
                ];
            } else {
                console.log('TidligereMeldekortListe var ikke 0');
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
    sjekkOmBrukerHarTidligereMeldekort,
);