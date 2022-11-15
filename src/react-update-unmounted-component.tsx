import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { wait } from './wait';

// [Removed from React 18](https://github.com/facebook/react/pull/22114)
test("Can't perform a React state update on an unmounted component", async () => {
  expect.assertions(1);

  function MyComponent() {
    const [, setState] = useState('Initial state');

    async function handleClick() {
      await wait(10);

      // [Removed from React 18](https://github.com/facebook/react/pull/22114)
      // "throw-on console.error: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."
      expect(() => setState('Update state')).not.toThrow();
    }

    return (
      <button type="button" onClick={handleClick}>
        button
      </button>
    );
  }

  const { unmount } = render(<MyComponent />);

  const button = screen.getByText<HTMLButtonElement>('button');

  fireEvent.click(button);

  unmount();

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(() => wait(10 + 10));
});
