// React keys for a list whose items can repeat (two milestones of one year,
// two links with one address). The first item keeps the plain key, the next
// ones get a counter, so a key is never used twice.

export function withKeys<T>(
  items: readonly T[],
  keyOf: (item: T) => string,
): { key: string; item: T }[] {
  const used = new Set<string>();
  return items.map((item) => {
    const base = keyOf(item);
    let key = base;
    for (let n = 2; used.has(key); n += 1) key = `${base}#${n}`;
    used.add(key);
    return { key, item };
  });
}
