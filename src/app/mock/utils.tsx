export function erLocalhost() {
  const host: string = window.location.host;
  return host.includes('localhost') || host.includes('127.0.0.1');
}

export function erMock(): boolean {
  let meldekort = 'meldekort_ver';
  window[meldekort] = {
    MELDEKORTSESSIONSTORAGE_USERNAME: 'username',
    MELDEKORTSESSIONSTORAGE_PASSWORD: 'password',
  };

  return process.env.REACT_APP_MOCK_FULL === 'true';
}
