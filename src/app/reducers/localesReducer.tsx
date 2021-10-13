import * as React from 'react';
import NorskFlaggSVG from '../components/sprakvelger/NorskFlaggSVG';
import EngelskFlaggSVG from '../components/sprakvelger/EngelskFlaggSVG';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataEN from 'react-intl/locale-data/en';
import * as http from 'http';

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

export const downloadMessages = async (language: string, from: string) => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/getall?language=' + language + '&from=' + from,
    method: 'GET',
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      // on bad status, reject
      if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        return reject(new Error('statusCode=' + res.statusCode));
      }

      let data = '';

      // on response data, cumulate it
      res.on('data', chunk => {
        data += chunk;
      });

      // on end, parse and resolve
      res.on('end', () => {
        resolve(JSON.parse(data));
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
