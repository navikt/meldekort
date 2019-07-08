import * as React from 'react';

function giveMeFive(): number {
  return 5;
}

test('generateTestAttribute', () => {
  expect(giveMeFive()).toBe(5);
});
