// The channel between the package buttons and the sponsor form. They are two
// client components far apart in the page, so a small store replaces a click
// listener on the document: a button announces the package it stands for, the
// form reads the announcement through `useSyncExternalStore`. Each call makes a
// new object, so choosing the same package twice is two announcements.

export type PackageChoice = { readonly packageId: string };

let current: PackageChoice | null = null;
const listeners = new Set<() => void>();

export function choosePackage(packageId: string): void {
  current = { packageId };
  for (const listener of listeners) listener();
}

export function subscribePackageChoice(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function currentPackageChoice(): PackageChoice | null {
  return current;
}

/** The exported HTML and the first client render have no choice. */
export function noPackageChoice(): null {
  return null;
}
