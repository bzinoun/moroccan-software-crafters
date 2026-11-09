// Port: where the site reports what the team needs to see (a failed send, a
// form that is not connected). Production writes to the browser console.

export type ErrorReporter = {
  report(message: string, cause?: unknown): void;
};

type Log = (...args: unknown[]) => void;

/** `log` is for a test; the default reads `console.error` when it is called. */
export function reporterTo(
  log: Log = (...args) => console.error(...args),
): ErrorReporter {
  return {
    report(message, cause) {
      if (cause === undefined) log(message);
      else log(message, cause);
    },
  };
}

export const consoleReporter = reporterTo();
