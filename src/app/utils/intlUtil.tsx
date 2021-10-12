import { IntlProvider } from 'react-intl';
import { store } from '../store/configureStore';

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
