import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../app/store/configureStore';
import { IntlProvider } from 'react-intl-redux';
import Sprakvelger from '../app/components/sprakvelger/sprakvelger';

it('renders correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <IntlProvider locale="nb" defaultLocale="nb">
        <Sprakvelger />
      </IntlProvider>
    </Provider>
  );
  expect(tree).toMatchSnapshot();
});
