import * as React from 'react';
import { store } from '../../app/store/configureStore';
import { IntlProvider } from 'react-intl-redux';
import { Provider } from 'react-redux';

interface Props {
  children: React.ReactNode;
}

const ProviderWrapper: React.FunctionComponent<Props> = props => {
  return (
    <Provider store={store}>
      <IntlProvider locale="nb" defaultLocale="nb">
        {props.children}
      </IntlProvider>
    </Provider>
  );
};

export default ProviderWrapper;
