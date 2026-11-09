import type { Clock } from "@/lib/ports/clock";

/** A clock that answers one instant until the test moves it. */
export function inMemoryClock(start: Date) {
  let current = start;
  const clock: Clock = { now: () => new Date(current) };
  return {
    ...clock,
    set(next: Date) {
      current = next;
    },
  };
}
