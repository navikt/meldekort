import NorskFlaggSVG from '../components/sprakvelger/NorskFlaggSVG';
import * as React from 'react';
import EngelskFlaggSVG from '../components/sprakvelger/EngelskFlaggSVG';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataNN from 'react-intl/locale-data/nn';
import localeDataEN from 'react-intl/locale-data/en';

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
  nb: () => import('../tekster/nb.json'),
  nn: () => import('../tekster/nn.json'),
  en: () => import('../tekster/en.json'),
};

/*
const currentDate = new Date();
const time = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate().toString().padStart(2, '0') +
  ' ' + currentDate.getHours().toString().padStart(2, '0') +
  ':' + currentDate.getMinutes().toString().padStart(2, '0') +
  ':' + currentDate.getSeconds().toString().padStart(2, '0');

const db = new Database('texts.sqlite');

const result = db.prepare("SELECT value " +
  "FROM texts " +
  "WHERE key = ? " +
  "AND language = ? " +
  "AND fromDateTime <= ? " +
  "ORDER BY datetime(fromDateTime) DESC"
).get(
  tekstid,
  hentLocale(),
  time
);

// result is undefined if nothing has been found
let value = tekstid.split('-')[0]
if (result) {
  value = tekstid;
}

db.close();

return value;
*/

export default localesReducer;
