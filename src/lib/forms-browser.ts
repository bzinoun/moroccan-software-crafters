// Browser wiring for `submitForm`: reads the real globals at call time.
// Call it from event handlers and effects only, never during render or build.

import { saveLead } from "@/app/actions/save-lead";
import {
  submitForm,
  type SubmitDeps,
  type SubmitInput,
  type SubmitResult,
} from "./forms";

/**
 * `fetchFn` and `send` are for a test; by default fetch reads `window.fetch`
 * when it is called and `send` is the saveLead Server Action.
 */
export function browserDeps(
  fetchFn: typeof fetch = (...args) => window.fetch(...args),
  send: SubmitDeps["send"] = saveLead,
): SubmitDeps {
  return {
    fetch: fetchFn,
    send,
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
