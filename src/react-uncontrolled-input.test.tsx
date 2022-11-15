import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

// Moved to a separate file, works solo but messes with the other tests (React 17.0.2) when inside throwOnConsole.test.tsx

test('A component is changing an uncontrolled input to be controlled', () => {
  function MyComponent() {
    const [name, setName] = useState<string | undefined>();
    return (
      <label>
        Name
        <input value={name} onChange={({ target }) => setName(target.value)} />
      </label>
    );
  }

  render(<MyComponent />);

  const input = screen.getByLabelText<HTMLInputElement>('Name');

  expect(() => fireEvent.change(input, { target: { value: 'John' } })).toThrow(
    'throw-on console.error: Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components'
  );
});
