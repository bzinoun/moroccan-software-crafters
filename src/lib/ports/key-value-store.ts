// Port: a small text store, the part of `Storage` that the site uses (the
// saved draft of the host funnel). A call can throw, for example in private
// browsing: callers handle it.

export type KeyValueStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

/** `localStorage`, read at call time so a server render never touches it. */
export const browserStorage: KeyValueStore = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: (key) => window.localStorage.removeItem(key),
};
