import { LocalesActions } from '../types/locales';
import tekster from '../tekster/kompilerte-tekster';

export interface SprakObj {
  label: string;
  tittel: string;
  tekster: {};
}

export interface LocalesState {
  nb: SprakObj;
  en: SprakObj;
}

const initialState: LocalesState = {
  nb: {
    label: 'nb',
    tittel: 'Norsk',
    tekster: tekster.nb,
  },
  en: {
    label: 'en',
    tittel: 'English',
    tekster: tekster.en,
  },
};

const localesReducer = (
  state: LocalesState = initialState,
  action: LocalesActions
): LocalesState => {
  return state;
};

export default localesReducer;
