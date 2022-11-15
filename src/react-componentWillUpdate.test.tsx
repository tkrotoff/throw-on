import { render } from '@testing-library/react';
import { Component } from 'react';

function DivComponent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

test('componentWillUpdate has been renamed, and is not recommended for use', () => {
  class MyComponent extends Component {
    // eslint-disable-next-line react/no-deprecated, @typescript-eslint/no-empty-function
    componentWillUpdate() {}

    render() {
      return <DivComponent />;
    }
  }

  expect(() => render(<MyComponent />)).toThrow(
    'throw-on console.warn: Warning: componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.'
  );

  // React does not display this warning message if it has already been displayed
  // Subsequent calls after a throw won't throw because of
  // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactStrictModeWarnings.old.js#L68-L70
  expect(() => render(<MyComponent />)).not.toThrow();
});
