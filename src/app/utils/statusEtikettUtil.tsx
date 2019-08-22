export const finnRiktigEtikettKlasse = (statustekst: string): string => {
  let status = statustekst.trim();
  if (statustekst == null) {
    status = 'info';
  }
  if (status === 'Klar til beregning' || status === 'Til behandling') {
    status = '__informativ';
  } else if (status === 'Kortet er beregnet') {
    status = '__positiv';
  } else if (status === 'Ingen beregning') {
    status = '__fremhevet';
  } else {
    status = '__fokusert';
  }
  return 'etikettbase' + status;
};
