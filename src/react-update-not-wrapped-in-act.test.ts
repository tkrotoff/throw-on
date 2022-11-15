import { renderHook } from '@testing-library/react';
import { useState } from 'react';

test('An update inside a test was not wrapped in act(...)', () => {
  function useCounter() {
    const [count, setCount] = useState(0);

    function increment() {
      setCount(count + 1);
    }

    return { count, increment };
  }

  const { result } = renderHook(() => useCounter());
  const { increment } = result.current;

  expect(() => increment()).toThrow(
    'Warning: An update to TestComponent inside a test was not wrapped in act(...).'
  );

  expect(() => increment()).toThrow(
    'Warning: An update to TestComponent inside a test was not wrapped in act(...).'
  );
});
