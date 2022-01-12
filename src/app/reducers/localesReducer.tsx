import * as React from 'react';
import NorskFlaggSVG from '../components/sprakvelger/NorskFlaggSVG';
import EngelskFlaggSVG from '../components/sprakvelger/EngelskFlaggSVG';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataEN from 'react-intl/locale-data/en';
import { Konstanter } from '../utils/consts';
import { fetchGet } from '../api/api';
import Environment from '../utils/env';

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
  fromDate: string;
  messages: object;
  validUntil: number;
}

const localeCache = new Array<LocaleCache>();

export const downloadMessages = async (sprak: string, fraDato: string) => {
  fraDato = fraDato.substring(0, 10); // meldeperiod har tid, men vi trenger ikke den

  const cachedLocale = localeCache.find(
    cachedLocale =>
      cachedLocale.label === sprak && cachedLocale.fromDate === fraDato
  );
  const now = new Date().getTime();
  const validUntil = now + 1800000; // Milliseconds
  if (cachedLocale && cachedLocale.validUntil >= now) {
    return new Promise(resolve => {
      resolve(cachedLocale.messages);
    });
  }

  return new Promise((resolve, reject) => {
    fetchGet(
      Konstanter().hentAlleTekster + '?sprak=' + sprak + '&fraDato=' + fraDato
    )
      .then(data => {
        if (cachedLocale) {
          cachedLocale.messages = data;
          cachedLocale.validUntil = validUntil;
        } else {
          localeCache.push({
            label: sprak,
            fromDate: fraDato,
            messages: data,
            validUntil: validUntil,
          });
        }
        resolve(data);
      })
      .catch(error => {
        console.log('Kunne ikke hente tekster');
        console.log(error);
        window.location.assign(
          `${Environment().loginUrl}&redirect=${window.location.origin}` +
            Konstanter().basePath
        );
      });
  });
};

export default localesReducer;
