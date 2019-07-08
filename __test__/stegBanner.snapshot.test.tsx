import * as React from 'react';
import StegBanner from '../src/app/components/stegBanner/stegBanner';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<StegBanner />);
  expect(tree).toMatchSnapshot();
});
