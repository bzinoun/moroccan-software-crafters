import type { ErrorReporter } from "@/lib/ports/error-reporter";

export type Report = { message: string; cause?: unknown };

/** A reporter that records each report in an array instead of writing to the console. */
export function inMemoryErrorReporter() {
  const reports: Report[] = [];
  const reporter: ErrorReporter = {
    report(message, cause) {
      reports.push(cause === undefined ? { message } : { message, cause });
    },
  };
  return { ...reporter, reports };
}
