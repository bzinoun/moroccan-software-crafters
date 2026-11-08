import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};
const inBrowser = () => true;
const onServer = () => false;

/**
 * False in the server render and while React hydrates it, true in the browser
 * once hydration is done (and in a plain client render). The first render
 * matches the exported HTML with no effect and no mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, inBrowser, onServer);
}
