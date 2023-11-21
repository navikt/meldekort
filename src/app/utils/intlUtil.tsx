import { createIntl } from 'react-intl';
import { store } from '../store/configureStore';
import { Konstanter } from './consts';
import { fetchGet } from '../api/api';
import Environment from './env';
import { formaterDatoIso } from './dates';
import { UiActions } from '../actions/ui';
import { updateIntl } from 'react-intl-redux';
import { InnsendingActions } from '../actions/innsending';
import { Begrunnelse } from '../types/innsending';

interface LocaleCache {
  label: string;
  fromDate: string;
  messages: object;
  validUntil: number;
}

const localeCache = new Array<LocaleCache>();

let processing = false;

export const downloadMessagesAndDispatch = (locale: string, from: Date) => {
  store.dispatch(UiActions.startLoading());

  downloadMessages(locale, from)
    .then((messages: object) => {
      // Vi må oppdatere teksten til den valgte begrunnelsen
      const innsending = store.getState().innsending;
      const optionsString = messages['korriger.begrunnelse.valg'];
      const options = JSON.parse(optionsString ? optionsString : '{}');
      const begrunnelse: Begrunnelse = {
        valgtArsak: innsending.begrunnelse.valgtArsak,
        valgtArsakTekst: options[innsending.begrunnelse.valgtArsak],
        erFeil: false,
      };
      store.dispatch(InnsendingActions.settBegrunnelse(begrunnelse));

      store.dispatch(updateIntl({ locale: locale, messages: messages }));
    })
    .catch(error => {
      console.log(error);
      downloadMessagesAndDispatch(locale, from);
    })
    .finally(() => {
      store.dispatch(UiActions.stopLoading());
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
    const data = await fetchGet(
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
      return {};
    } else {
      throw 'Meldekortutfylling er ikke tilgjengelig, det kan skyldes vedlikehold eller teknisk feil. Prøv igjen senere.';
    }
  } finally {
    processing = false;
  }
};

export const hentIntl = () => {
  const intlState = store.getState().intl;

  return createIntl({
    locale: intlState.locale,
    messages: intlState.messages
  })
};

export const hentLocale = () => {
  return store.getState().intl.locale;
};

// FormattedHTMLMessage & intl.formatHTMLMessage har blitt fjernet fra react-intl v4
// FormattedMessage og intl.formatMessage viser ikke HTML
export const formatMessage = (id: string | undefined, values?: object): JSX.Element => {
  const text = hentIntl().formatMessage(
    {
      id: id
    },
    {
      ...values
    }
  )

  return (
    <span dangerouslySetInnerHTML={{__html: text}} />
  )
}
