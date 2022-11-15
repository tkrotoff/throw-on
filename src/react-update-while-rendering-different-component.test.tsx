import { render } from '@testing-library/react';
import { useState } from 'react';

test('Cannot update a component while rendering a different component', () => {
  function Child({ setState }: { setState: (newState: string) => void }) {
    setState('Update state');
    return <div />;
  }

  function Parent() {
    const [, setState] = useState('Initial state');
    return <Child setState={setState} />;
  }

  expect(() => render(<Parent />)).toThrow(
    'throw-on console.error: Warning: Cannot update a component (`Parent`) while rendering a different component (`Child`). To locate the bad setState() call inside `Child`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render'
  );

  // React does not display this warning message if it has already been displayed
  // Subsequent calls after a throw won't throw because of
  // https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L3210-L3211
  expect(() => render(<Parent />)).not.toThrow();
});
