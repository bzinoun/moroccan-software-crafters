import { render, type RenderResult } from "@testing-library/react";
import { Component, type ReactNode } from "react";

// A render that is expected to throw: an error boundary catches it, and React
// hands it to `onCaughtError` instead of the console, so the test output stays
// clean and the test can read the error.

class Boundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  override state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override render() {
    return this.state.error ? null : this.props.children;
  }
}

export function renderCatching(ui: ReactNode): RenderResult & {
  errors: unknown[];
} {
  const errors: unknown[] = [];
  const view = render(<Boundary>{ui}</Boundary>, {
    onCaughtError: (error) => errors.push(error),
  });
  return { ...view, errors };
}
