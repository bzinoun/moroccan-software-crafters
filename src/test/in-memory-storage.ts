import type { KeyValueStore } from "@/lib/ports/key-value-store";

/** A store that keeps its text in a Map. `entries` lets a test read and seed it. */
export function inMemoryStorage(initial: Record<string, string> = {}) {
  const entries = new Map<string, string>(Object.entries(initial));
  const store: KeyValueStore = {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
    removeItem: (key) => {
      entries.delete(key);
    },
  };
  return { ...store, entries };
}

/** A store that refuses every call, as the browser does in private browsing. */
export function deniedStorage(): KeyValueStore {
  const deny = (): never => {
    throw new Error("denied");
  };
  return { getItem: deny, setItem: deny, removeItem: deny };
}
