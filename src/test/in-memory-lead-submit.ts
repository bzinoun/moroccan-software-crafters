import type { SubmitInput, SubmitResult } from "@/lib/forms";
import type { Submit } from "@/lib/submit-outcome";

/**
 * The send function of a lead form, answered from memory. It never reaches a
 * network. `calls` lists every input it received. `answer` and `fail` set the
 * default reply; the `Once` variants and `hold` queue a reply for the next call.
 */
export function inMemoryLeadSubmit(
  initial: SubmitResult = { mode: "endpoint" },
) {
  const calls: SubmitInput[] = [];
  const queue: Array<() => Promise<SubmitResult>> = [];
  let fallback: () => Promise<SubmitResult> = () => Promise.resolve(initial);

  const submit: Submit = (input) => {
    calls.push(input);
    return (queue.shift() ?? fallback)();
  };

  return {
    submit,
    calls,
    /** Default reply from now on. */
    answer(result: SubmitResult) {
      fallback = () => Promise.resolve(result);
    },
    /** Reply for the next call only. */
    answerOnce(result: SubmitResult) {
      queue.push(() => Promise.resolve(result));
    },
    /** The send throws, from now on. */
    fail(error: Error) {
      fallback = () => Promise.reject(error);
    },
    /** The next send throws, then the default reply comes back. */
    failOnce(error: Error) {
      queue.push(() => Promise.reject(error));
    },
    /** The next send stays pending until `settle` is called. */
    hold() {
      let settle: (result: SubmitResult) => void = () => {};
      const pending = new Promise<SubmitResult>((resolve) => {
        settle = resolve;
      });
      queue.push(() => pending);
      return { settle };
    },
  };
}
