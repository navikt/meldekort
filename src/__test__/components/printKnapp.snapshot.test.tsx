import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper from '../utils/providerWrapper';
import PrintKnapp from '../../app/components/print/printKnapp';

it('Sprakvelger', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <PrintKnapp innholdRenderer={innhold} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});

const innhold = () => {
  return <span>Test</span>;
};
