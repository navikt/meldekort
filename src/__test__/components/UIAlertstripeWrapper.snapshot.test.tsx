import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import UIAlertstripeWrapper from '../../app/components/feil/UIAlertstripeWrapper';

it('UIAlertstripeWrapper', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <UIAlertstripeWrapper />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
