import { addLocaleData, IntlProvider } from 'react-intl';
import localeDataNB from 'react-intl/locale-data/nb';
import localeDataEN from 'react-intl/locale-data/en';
import { store } from '../store/configureStore';

export const hentIntl = () => {

    addLocaleData([...localeDataNB, ...localeDataEN]);
    const intlState = store.getState().intl;
    const intlProvider = new IntlProvider({locale: intlState.locale, messages: intlState.messages});
    const { intl } = intlProvider.getChildContext();
    return intl;
};

export const hentLocale = () => {
    return store.getState().intl.locale;
};