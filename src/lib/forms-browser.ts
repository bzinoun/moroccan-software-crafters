// Browser wiring for `submitForm`: reads the real globals at call time.
// Call it from event handlers and effects only, never during render or build.

import {
  submitForm,
  type SubmitDeps,
  type SubmitInput,
  type SubmitResult,
} from "./forms";

export function browserDeps(): SubmitDeps {
  return {
    fetch: (...args) => window.fetch(...args),
    assignLocation: (url) => {
      window.location.href = url;
    },
    now: () => new Date(),
    href: window.location.href,
    search: window.location.search,
    referrer: document.referrer,
  };
}

export function submitFormInBrowser(input: SubmitInput): Promise<SubmitResult> {
  return submitForm(input, browserDeps());
}
