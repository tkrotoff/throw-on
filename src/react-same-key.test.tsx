import { render } from '@testing-library/react';

function DivComponent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

test('Encountered two children with the same key', () => {
  expect(() =>
    render(<DivComponent>{[<DivComponent key="0" />, <DivComponent key="0" />]}</DivComponent>)
  ).toThrow(
    'throw-on console.error: Warning: Encountered two children with the same key, `0`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.'
  );
});
