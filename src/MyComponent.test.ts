import { renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';

import { restoreConsole } from './throwOnConsole';

restoreConsole('error');

function useCounter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  return { count, increment };
}

test('should render', () => {
  const { result } = renderHook(() => useCounter());
  result.current.increment();
});
