export const Konstanter = () => {
  return {
    hentHistoriskeMeldekortApiUri: 'person/historiskemeldekort',
    hentMeldekortdetaljerApiUri: 'meldekort/{id}',
    hentPersonStatusApiUri: 'person/status',
    hentPersonInfoApiUri: 'person/info',
    hentMeldekortApiUri: 'person/meldekort',
    sendMeldekortApiUri: 'person/meldekort',
    sendMeldeformApiUri: 'person/meldeform',
    hentKorrigertMeldekortIdApiUri: 'meldekort/{id}/korrigering',
    hentInfomelding: 'meldekort/infomelding',
    pingWeblogic: 'weblogic/ping',
    metodeGet: 'GET',
    metodePost: 'POST',
    forsteUke: 1,
    andreUke: 2,
    pas: 'PASSWORD',
    use: 'USERNAME',
  };
};

export const Nettlesere = () => {
  return {
    chrome: 'https://www.chrome.com',
    firefox: 'https://www.firefox.com',
    edge: 'https://www.microsoft.com/nb-no/windows/microsoft-edge',
  };
};
