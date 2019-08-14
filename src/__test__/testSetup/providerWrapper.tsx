import * as React from 'react';
import { store } from '../../app/store/configureStore';
import { IntlProvider } from 'react-intl-redux';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import tekster from '../../app/tekster/kompilerte-tekster';

interface Props {
  children: React.ReactNode;
  initialState?: any;
  initialStateName?: string;
}

const ProviderWrapper: React.FunctionComponent<Props> = props => {
  let testStore;
  if (props.initialState !== undefined) {
    let { initialState, initialStateName } = props;
    const mockState = {
      [initialStateName!]: initialState,
      intl: {
        locale: 'nb',
        messages: tekster.nb,
      },
    };
    const mockStore = configureStore();
    testStore = mockStore(mockState);
  } else {
    testStore = store;
  }

  return (
    <Provider store={testStore}>
      <IntlProvider locale="nb" defaultLocale="nb">
        {props.children}
      </IntlProvider>
    </Provider>
  );
};

export default ProviderWrapper;
