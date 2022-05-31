import { IntlProvider } from 'react-intl';
import { store } from '../store/configureStore';
import { Konstanter } from './consts';
import { fetchGet } from '../api/api';
import Environment from './env';
import { formaterDatoIso } from './dates';

interface LocaleCache {
  label: string;
  fromDate: string;
  messages: object;
  validUntil: number;
}

const localeCache = new Array<LocaleCache>();

export const downloadMessages = async (sprak: string, fraDato: Date) => {
  const fraDatoFormatert = formaterDatoIso(fraDato);

  const cachedLocale = localeCache.find(
    cachedLocale =>
      cachedLocale.label === sprak && cachedLocale.fromDate === fraDatoFormatert
  );
  const now = new Date().getTime();
  const validUntil = now + Konstanter.cachedLocaleValidity;
  if (cachedLocale && cachedLocale.validUntil >= now) {
    return new Promise(resolve => {
      resolve(cachedLocale.messages);
    });
  }

  return new Promise((resolve, reject) => {
    fetchGet(
      Konstanter.hentAlleTekster +
        '?sprak=' +
        sprak +
        '&fraDato=' +
        fraDatoFormatert
    )
      .then(data => {
        if (cachedLocale) {
          cachedLocale.messages = data;
          cachedLocale.validUntil = validUntil;
        } else {
          localeCache.push({
            label: sprak,
            fromDate: fraDatoFormatert,
            messages: data,
            validUntil: validUntil,
          });
        }
        resolve(data);
      })
      .catch(error => {
        if (error.message === 'Request failed with status code 401') {
          // Bruker er ikke innlogget, sender ham til innogging
          window.location.assign(
            `${Environment().loginUrl}&redirect=${window.location.origin}` +
              Konstanter.basePath
          );
        } else {
          reject('Meldekortutfylling er ikke tilgjengelig, det kan skyldes vedlikehold eller teknisk feil, prøv igjen senere.');
        }
      });
  });
};

export const hentIntl = () => {
  const intlState = store.getState().intl;
  const intlProvider = new IntlProvider({
    locale: intlState.locale,
    messages: intlState.messages,
  });
  const { intl } = intlProvider.getChildContext();
  return intl;
};

export const hentLocale = () => {
  return store.getState().intl.locale;
};
