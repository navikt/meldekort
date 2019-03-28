import { erLocalhost, erMock } from '../mock/utils';

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
            apiUrl: 'https://www-q1.nav.no/meldekort/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    } else if (erMock()) {
        return {
            apiUrl: '',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    } else if (erLocalhost()) {
        return {
            apiUrl: 'http://localhost:8801/meldekort/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo'
        };
    }
    return {
        // TODO: Her skal prod-urler inn
        apiUrl: 'https://www-q0.nav.no/meldekort/meldekort-api/api/',
        loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
        logoutUrl: 'https://loginservice-q.nav.no/slo'
    };
};

export default Environment;