import { render } from '@testing-library/react';
import { createContext, useContext, useState } from 'react';

function DivComponent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

test('React has detected a change in the order of Hooks', () => {
  const Context = createContext('context');

  const hook = {
    useContext: () => useContext(Context)
  };

  function MyComponent() {
    hook.useContext();
    useState('Initial state');
    return <DivComponent />;
  }

  // mockReturnValueOnce() is very important here
  // https://stackoverflow.com/a/68376129
  jest.spyOn(hook, 'useContext').mockReturnValueOnce('context');

  const { rerender } = render(<MyComponent />);

  expect(() => rerender(<MyComponent />)).toThrow(
    'throw-on console.error: Warning: React has detected a change in the order of Hooks called by MyComponent. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks'
  );
});
