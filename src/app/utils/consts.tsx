export const Konstanter = {
  basePath: '/meldekort',
  hentHistoriskeMeldekortApiUri: 'person/historiskemeldekort',
  hentMeldekortdetaljerApiUri: 'meldekort/{id}',
  hentPersonStatusApiUri: 'person/status',
  hentPersonInfoApiUri: 'person/info',
  hentMeldekortApiUri: 'person/meldekort',
  sendMeldekortApiUri: 'person/meldekort',
  hentKorrigertMeldekortIdApiUri: 'meldekort/{id}/korrigering',
  hentInfomelding: 'meldekort/infomelding',
  hentSkrivemodus: 'skrivemodus',
  hentAlleTekster: 'tekst/hentAlle',
  erViggo: 'viggo/erViggo',
  metodeGet: 'GET',
  metodePost: 'POST',
  forsteUke: 1,
  andreUke: 2,
  pas: 'PASSWORD',
  use: 'USERNAME',
  defaultLocale: 'nb',
  defaultFromDate: new Date('1000-01-01'),
  cachedLocaleValidity: 1800000, // Milliseconds
};

export const Nettlesere = {
  chrome: 'https://www.chrome.com',
  firefox: 'https://www.firefox.com',
  edge: 'https://www.microsoft.com/nb-no/windows/microsoft-edge',
};
