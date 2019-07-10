import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import PrintKnapp from '../../app/components/print/printKnapp';

it('PrintKnapp', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <PrintKnapp
        innholdRenderer={() => {
          return <span>Test</span>;
        }}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
