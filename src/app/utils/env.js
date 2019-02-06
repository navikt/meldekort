const Environment = () => {

    if (window.location.hostname.indexOf('www-q0.nav.no') > -1) {
        return {
            apiUrl: 'https://meldekort-api-q0.nais.oera-q.local/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login',
            logoutUrl: 'https://loginservice-q.nav.no/slo',
        };
    }

    return {
        apiUrl: 'https://tjenester.nav.no/personopplysninger-api/personalia',
        loginUrl: 'https://loginservice.nav.no/login',
        logoutUrl: 'https://loginservice.nav.no/slo',
    };
};

export default Environment;