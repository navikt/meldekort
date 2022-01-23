import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ProviderWrapper, {
  setLocalesBeforeAll,
} from '../testSetup/providerWrapper';
import PrintKnapp from '../../app/components/print/printKnapp';
import { testPerson, testPersoninfo } from '../testSetup/testData';

setLocalesBeforeAll();

it('PrintKnapp', () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <PrintKnapp
        innholdRenderer={() => {
          return <span>Test</span>;
        }}
        person={testPerson}
        personInfo={testPersoninfo}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
