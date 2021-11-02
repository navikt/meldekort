import * as React from 'react';
import NorskFlaggSVG from '../components/sprakvelger/NorskFlaggSVG';
import EngelskFlaggSVG from '../components/sprakvelger/EngelskFlaggSVG';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataEN from 'react-intl/locale-data/en';
import * as http from 'http';
import { Konstanter } from '../utils/consts';
import { erLocalhost } from '../mock/utils';

export interface Locale {
  label: string;
  tittel: string;
  ikon: JSX.Element;
  localeData: ReactIntl.LocaleData;
}

export interface Locales extends Array<Locale> {}

const initialState: Locales = [
  {
    label: 'nb',
    tittel: 'Norsk',
    ikon: <NorskFlaggSVG />,
    localeData: localeDataNB,
  },
  /*
  {
    label: 'nn',
    tittel: 'Nynorsk',
    ikon: <NorskFlaggSVG />,
    localeData: localeDataNN,
  },
  */
  {
    label: 'en',
    tittel: 'English',
    ikon: <EngelskFlaggSVG />,
    localeData: localeDataEN,
  },
];

const localesReducer = (
  state: Locales = initialState,
  action: any
): Locales => {
  return state;
};

interface LocaleCache {
  label: string;
  fromTime: string;
  messages: object;
  validUntil: number;
}
const localeCache = new Array<LocaleCache>();

export const downloadMessages = async (language: string, from: string) => {
  const options = {
    hostname: window.location.hostname,
    port: window.location.port || 8080,
    path:
      (erLocalhost() ? '' : Konstanter().basePath) +
      '/texts/getall?language=' +
      language +
      '&from=' +
      from,
    method: 'GET',
  };

  const cachedLocale = localeCache.find(
    cachedLocale =>
      cachedLocale.label === language && cachedLocale.fromTime === from
  );
  const now = new Date().getTime();
  const validUntil = now + 1800000; // Milliseconds
  if (cachedLocale && cachedLocale.validUntil >= now) {
    return new Promise(resolve => {
      resolve(cachedLocale.messages);
    });
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      // on bad status, reject
      if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        reject(new Error('statusCode=' + res.statusCode));
      }

      let data = '';

      // on response data, cumulate it
      res.on('data', chunk => {
        data += chunk;
      });

      // on end, parse and resolve
      res.on('end', () => {
        const messages = JSON.parse(data);

        if (cachedLocale) {
          cachedLocale.messages = messages;
          cachedLocale.validUntil = validUntil;
        } else {
          localeCache.push({
            label: language,
            fromTime: from,
            messages: messages,
            validUntil: validUntil,
          });
        }
        resolve(messages);
      });
    });

    // on request error, reject
    req.on('error', err => {
      reject(err);
    });

    req.end();
  });
};

export default localesReducer;
