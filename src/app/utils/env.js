const Environment = () => {

    if (window.location.hostname.indexOf('www-q0.nav.no') > -1) {
        return {
            apiUrl: 'https://www-q0.nav.no/meldekort/meldekort-api/api/',
            loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
            logoutUrl: 'https://loginservice-q.nav.no/slo',
        };
    }

    return {
        apiUrl: 'https://www-q0.nav.no/meldekort/meldekort-api/api/',
        loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
        logoutUrl: 'https://loginservice-q.nav.no/slo',
    };
};

export default Environment;