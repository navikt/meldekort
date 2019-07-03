const Konstanter = () => {
  return {
    hentHistoriskeMeldekortApiUri: 'person/historiskemeldekort',
    hentMeldekortdetaljerApiUri: 'meldekort/{id}',
    hentPersonStatusApiUri: 'person/status',
    hentPersonInfoApiUri: 'person/info',
    hentMeldekortApiUri: 'person/meldekort',
    sendMeldekortApiUri: 'person/meldekort',
    sendMeldeformApiUri: 'person/meldeform',
    hentKorrigertMeldekortIdApiUri: 'meldekort/{id}/korrigering',
    metodeGet: 'GET',
    metodePost: 'POST',
    forsteUke: 1,
    andreUke: 2,
    pas: 'PASSWORD',
    use: 'USERNAME',
  };
};

export default Konstanter;
