import { KortStatus } from '../types/meldekort';

export const finnRiktigEtikettKlasse = (status: KortStatus): string => {
  let className: string;

  switch (status) {
    case KortStatus.KLAR:
      className = '__fokusert';
      break;
    case KortStatus.REGIS:
    case KortStatus.NYKTR:
    case KortStatus.UBEHA:
      className = '__informativ';
      break;
    case KortStatus.FERDI:
    case KortStatus.IKKE:
    case KortStatus.OVERM:
      className = '__positiv';
      break;
    default:
      className = '__fremhevet';
  }

  return 'etikettbase' + className;
};
