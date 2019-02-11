const Environment = () => {

    if (window.location.hostname.indexOf('www-q0.nav.no') > -1) {
        return {
            apiUrl: 'https://tjenester-q0.nav.no/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo',
        };
    }

    return {
        apiUrl: 'http://meldekort-api-q4.nais.oera-q.local/meldekort-api/api/',
        loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
        logoutUrl: 'https://loginservice-q.nav.no/slo',
    };
};

export default Environment;