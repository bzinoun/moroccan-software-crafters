/**
 * A callback that records the arguments of each call in an array: the in-memory
 * stand-in for an `on...` prop.
 */
export function recorder<Args extends unknown[]>() {
  const calls: Args[] = [];
  return {
    calls,
    fn: (...args: Args) => {
      calls.push(args);
    },
  };
}
