const Konstanter = () => {
    return {
        hentHistoriskeMeldekortApiUri: 'person/historiskemeldekort',
        hentMeldekortdetaljerApiUri: 'meldekort/{id}',
        hentPersonStatusApiUri: 'person/status',
        hentMeldekortApiUri: 'person/meldekort',
        sendMeldekortApiUri: 'person/meldekort',
        sendMeldeformApiUri: 'person/meldeform',
        hentKorrigertMeldekortIdApiUri: 'meldekort/{id}/korrigering',
        metodeGet: 'GET',
        metodePost: 'POST',
        forsteUke: 1,
        andreUke: 2
    };
};

export default Konstanter;