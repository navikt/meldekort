export const Konstanter = () => {
  return {
    basePath: '/meldekort',
    hentHistoriskeMeldekortApiUri: 'person/historiskemeldekort',
    hentMeldekortdetaljerApiUri: 'meldekort/{id}',
    hentPersonStatusApiUri: 'person/status',
    hentPersonInfoApiUri: 'person/info',
    hentMeldekortApiUri: 'person/meldekort',
    sendMeldekortApiUri: 'person/meldekort',
    hentKorrigertMeldekortIdApiUri: 'meldekort/{id}/korrigering',
    hentInfomelding: 'meldekort/infomelding',
    pingWeblogic: 'weblogic/ping',
    hentAlleTekster: 'tekst/hentAlle',
    metodeGet: 'GET',
    metodePost: 'POST',
    forsteUke: 1,
    andreUke: 2,
    pas: 'PASSWORD',
    use: 'USERNAME',
    defaultLocale: 'nb',
    defaultFromDate: '1000-01-01',
  };
};

export const Nettlesere = () => {
  return {
    chrome: 'https://www.chrome.com',
    firefox: 'https://www.firefox.com',
    edge: 'https://www.microsoft.com/nb-no/windows/microsoft-edge',
  };
};
