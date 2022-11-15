import { render } from '@testing-library/react';

function DivComponent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

test('Each child in a list should have a unique "key" prop.', () => {
  expect(() => render(<DivComponent>{[<DivComponent />, <DivComponent />]}</DivComponent>)).toThrow(
    'throw-on console.error: Warning: Each child in a list should have a unique "key" prop.'
  );

  // React does not display this warning message if it has already been displayed
  // Subsequent calls after a throw won't throw because of
  // https://github.com/facebook/react/blob/v17.0.2/packages/react/src/jsx/ReactJSXElementValidator.js#L142-L144
  expect(() =>
    render(<DivComponent>{[<DivComponent />, <DivComponent />]}</DivComponent>)
  ).not.toThrow();
});
