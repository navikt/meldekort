import * as React from 'react';
import { store } from '../../app/store/configureStore';
import { IntlProvider, IntlState, updateIntl } from 'react-intl-redux';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { downloadMessages } from '../../app/reducers/localesReducer';
import { Konstanter } from '../../app/utils/consts';

interface Props {
  children: React.ReactNode;
  initialState?: any;
  initialStateName?: string;
}

let intl: IntlState;

const ProviderWrapper: React.FunctionComponent<Props> = props => {
  let testStore;
  if (props.initialState !== undefined) {
    let { initialState, initialStateName } = props;
    const mockState = {
      [initialStateName!]: initialState,
      intl: intl,
    };
    const mockStore = configureStore();
    testStore = mockStore(mockState);
  } else {
    testStore = store;
  }

  return (
    <Provider store={testStore}>
      <IntlProvider
        locale={Konstanter().defaultLocale}
        defaultLocale={Konstanter().defaultLocale}
      >
        {props.children}
      </IntlProvider>
    </Provider>
  );
};

export const setLocalesBeforeAll = () => {
  beforeAll(async () => {
    return await downloadMessages(
      Konstanter().defaultLocale,
      Konstanter().defaultFromTime
    ).then((messages: object) => {
      store.dispatch(
        updateIntl({ locale: Konstanter().defaultLocale, messages: messages })
      );
      intl = { locale: Konstanter().defaultLocale, messages: messages };
    });
  });
};

export default ProviderWrapper;
