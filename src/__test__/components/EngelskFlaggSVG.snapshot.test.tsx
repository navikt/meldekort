import * as React from 'react';
import * as renderer from 'react-test-renderer';
import EngelskFlaggSVG from '../../app/components/sprakvelger/EngelskFlaggSVG';

it('EngelskFlaggSVG', () => {
  const tree = renderer.create(<EngelskFlaggSVG />);
  expect(tree).toMatchSnapshot();
});
