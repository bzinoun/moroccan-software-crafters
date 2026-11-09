// Browser wiring for `submitForm`: reads the real globals at call time.
// Call it from event handlers and effects only, never during render or build.

import {
  submitForm,
  type SubmitDeps,
  type SubmitInput,
  type SubmitResult,
} from "./forms";

/** `fetchFn` is for a test; the default reads `window.fetch` when it is called. */
export function browserDeps(
  fetchFn: typeof fetch = (...args) => window.fetch(...args),
): SubmitDeps {
  return {
    fetch: fetchFn,
    assignLocation: (url) => {
      window.location.href = url;
    },
    now: () => new Date(),
    href: window.location.href,
    search: window.location.search,
    referrer: document.referrer,
  };
}

/** `deps` is for a test, which passes an in-memory fetch instead of the network. */
export function submitFormInBrowser(
  input: SubmitInput,
  deps: SubmitDeps = browserDeps(),
): Promise<SubmitResult> {
  return submitForm(input, deps);
}
