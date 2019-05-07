import { erLocalhost, erMock } from '../mock/utils';
import Konstanter from './consts';

const Environment = () => {

    if (window.location.hostname.indexOf('www-q0.nav.no') > -1) {
        return {
            dittNavUrl: 'https://www-q0.nav.no/person/dittnav',
            apiUrl: 'https://www-q0.nav.no/meldekort/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    } else if (window.location.hostname.indexOf('www-q1.nav.no') > -1) {
        return {
            dittNavUrl: 'https://www-q1.nav.no/person/dittnav',
            apiUrl: 'https://www-q1.nav.no/meldekort/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    } else if (erMock()) {
        return {
            dittNavUrl: '',
            apiUrl: '',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    } else if (erLocalhost()) {
        return {
            dittNavUrl: '',
            apiUrl: 'http://localhost:8801/meldekort/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    }
    return {
        dittNavUrl: 'https://www.nav.no/person/dittnav',
        apiUrl: 'https://www.nav.no/meldekort/meldekort-api/api/',
        loginUrl: 'https://loginservice.nav.no/login?level=Level3',
        logoutUrl: 'https://loginservice.nav.no/slo'
    };
};

export default Environment;

export function hentEnvSetting(
    variableName: string,
) {
    const meldekort = 'meldekort';

    const varName1 = `${variableName}_${Konstanter().pas}`;
    const varName2 = `${variableName}_${Konstanter().use}`;

    const value1 =
        window[meldekort][varName1] ||
        window[meldekort][varName1];

    const value2 =
        window[meldekort][varName2] ||
        window[meldekort][varName2];

    return getKey(value1, value2);
}

function getKey(one:  string, two: string) {
    return btoa(`${one}:${two}`);
}