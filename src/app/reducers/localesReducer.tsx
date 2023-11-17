import * as React from 'react';
import NorskFlaggSVG from '../components/sprakvelger/NorskFlaggSVG';
import EngelskFlaggSVG from '../components/sprakvelger/EngelskFlaggSVG';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataEN from 'react-intl/locale-data/en';

export interface Locale {
  label: string;
  tittel: string;
  ikon: JSX.Element;
  localeData: ReactIntl.LocaleData;
}

export interface Locales extends Array<Locale> {}

const locales: Locales = [
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

const localesReducer = (state: Locales = locales): Locales => { // (state: Locales = locales, action: any)
  return state;
};

export default localesReducer;
