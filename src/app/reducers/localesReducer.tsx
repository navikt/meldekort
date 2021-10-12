import * as React from 'react';
import NorskFlaggSVG from '../components/sprakvelger/NorskFlaggSVG';
import EngelskFlaggSVG from '../components/sprakvelger/EngelskFlaggSVG';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataNN from 'react-intl/locale-data/nn';
import localeDataEN from 'react-intl/locale-data/en';
import * as http from 'http';

export interface SprakObj {
  label: string;
  tittel: string;
  ikon: JSX.Element;
  localeData: ReactIntl.LocaleData;
}

export interface LocalesState {
  nb: SprakObj;
  nn: SprakObj;
  en: SprakObj;
}

const initialState: LocalesState = {
  nb: {
    label: 'nb',
    tittel: 'Bokmål',
    ikon: <NorskFlaggSVG />,
    localeData: localeDataNB,
  },
  nn: {
    label: 'nn',
    tittel: 'Nynorsk',
    ikon: <NorskFlaggSVG />,
    localeData: localeDataNN,
  },
  en: {
    label: 'en',
    tittel: 'English',
    ikon: <EngelskFlaggSVG />,
    localeData: localeDataEN,
  },
};

const localesReducer = (
  state: LocalesState = initialState,
  action: any
): LocalesState => {
  return state;
};

export const messagesLoader = {
  nb: () => downloadMessages('nb'),
  nn: () => downloadMessages('nn'),
  en: () => downloadMessages('en'),
};

const downloadMessages = async (language: string) => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/getall?language=' + language,
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
