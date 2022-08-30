import { IntlProvider } from 'react-intl';
import { store } from '../store/configureStore';
import { Konstanter } from './consts';
import { fetchGet } from '../api/api';
import Environment from './env';
import { formaterDatoIso } from './dates';
import { UiActions } from '../actions/ui';
import { Dispatch } from 'redux';

interface LocaleCache {
  label: string;
  fromDate: string;
  messages: object;
  validUntil: number;
}

const localeCache = new Array<LocaleCache>();

let processing = false;

export const downloadMessagesAndDispatch = (
  locale: string,
  from: Date,
  dispatch: Dispatch,
  updateIntl: Function
) => {
  dispatch(UiActions.startLoading());

  downloadMessages(locale, from)
    .then((messages: object) => {
      dispatch(updateIntl({ locale: locale, messages: messages }));
    })
    .catch(error => {
      console.log(error);
      downloadMessagesAndDispatch(locale, from, dispatch, updateIntl);
    })
    .finally(() => {
      dispatch(UiActions.stopLoading());
    });
};

export const downloadMessagesAndCall = (
  locale: string,
  from: Date,
  startLoading: Function,
  stopLoading: Function,
  updateIntl: Function
) => {
  startLoading();

  downloadMessages(locale, from)
    .then((messages: object) => {
      updateIntl({ locale: locale, messages: messages });
    })
    .catch(error => {
      console.log(error);
      downloadMessagesAndCall(
        locale,
        from,
        startLoading,
        stopLoading,
        updateIntl
      );
    })
    .finally(() => {
      stopLoading();
    });
};

export const downloadMessages = async (sprak: string, fraDato: Date) => {
  // Make texts sync again!
  while (processing) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  processing = true;

  const fraDatoFormatert = formaterDatoIso(fraDato);

  const cachedLocale = localeCache.find(
    cachedLocale =>
      cachedLocale.label === sprak && cachedLocale.fromDate === fraDatoFormatert
  );
  const now = new Date().getTime();
  const validUntil = now + Konstanter.cachedLocaleValidity;

  if (cachedLocale && cachedLocale.validUntil >= now) {
    processing = false;
    return cachedLocale.messages;
  }

  try {
    let data = await fetchGet(
      Konstanter.hentAlleTekster +
        '?sprak=' +
        sprak +
        '&fraDato=' +
        fraDatoFormatert
    );

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

    return data;
  } catch (error) {
    console.log(error);

    if (
      error instanceof Error &&
      error.message === 'Request failed with status code 401'
    ) {
      // Bruker er ikke innlogget, sender ham til innogging
      window.location.assign(`${Environment().loginUrl}`);
    } else {
      throw 'Meldekortutfylling er ikke tilgjengelig, det kan skyldes vedlikehold eller teknisk feil. Prøv igjen senere.';
    }
  } finally {
    processing = false;
  }
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
