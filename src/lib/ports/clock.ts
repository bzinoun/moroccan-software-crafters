// Port: the current time. Production reads the system clock; a test passes a
// clock that always answers the same instant.

export type Clock = {
  now(): Date;
};

export const systemClock: Clock = {
  now: () => new Date(),
};
